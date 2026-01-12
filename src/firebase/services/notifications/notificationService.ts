import type { Task } from '@types';
import { createBrasiliaDate, formatBrasiliaDateTime, secondsUntilDate } from '@utils/dateUtils';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure default behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    } as any),
});

/**
 * Serviço de Notificações
 * 
 * Responsável por gerenciar notificações push e agendadas
 * Segue o Single Responsibility Principle (SRP)
 */
export const notificationService = {
    /**
     * Configura categorias de notificação com ações
     */
    async setupNotificationCategories(): Promise<void> {
        try {
            // Define categoria de notificação com ações
            await Notifications.setNotificationCategoryAsync('task-notification', [
                {
                    identifier: 'complete',
                    buttonTitle: '✓ Concluir',
                    options: {
                        opensAppToForeground: true, // Abre o app para garantir execução
                    },
                },
                {
                    identifier: 'skip',
                    buttonTitle: '⏭ Pular',
                    options: {
                        opensAppToForeground: true, // Abre o app para garantir execução
                    },
                },
            ]);
            console.log('[NotificationService] Notification categories configured');
        } catch (error) {
            console.error('[NotificationService] Error setting up categories:', error);
        }
    },

    /**
     * Solicita permissões para notificações
     */
    async requestPermissions(): Promise<boolean> {
        if (Platform.OS === 'android') {
            // Create notification channel with high importance for background notifications
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Notificações de Tarefas',
                description: 'Lembretes de tarefas e alertas',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#5271FF',
                enableVibrate: true,
                enableLights: true,
                showBadge: true,
                bypassDnd: true, // Bypass Do Not Disturb
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        // Setup notification categories after permissions
        if (finalStatus === 'granted') {
            await this.setupNotificationCategories();
        }

        return finalStatus === 'granted';
    },

    /**
     * Agenda notificações para uma tarefa
     */
    async scheduleTaskNotifications(task: Task): Promise<string[]> {
        // Skip notifications on web platform
        if (Platform.OS === 'web') {
            return [];
        }

        // Skip deleted tasks
        if (task.deletedAt) {
            console.log('[NotificationService] Skipping notifications for deleted task:', task.id);
            return [];
        }

        // Skip completed non-recurring tasks
        if (task.completed && (!task.recurrence || task.recurrence === 'none')) {
            console.log('[NotificationService] Skipping notifications for completed non-recurring task:', task.id);
            return [];
        }

        // Create due date using Brasilia timezone
        const dueDate = createBrasiliaDate(task.dueDate, task.dueTime || undefined);
        const now = new Date();
        const notificationIds: string[] = [];

        // DEBUG: Log timezone info
        console.log('[NotificationService] Scheduling notifications for task:', task.title);
        console.log('[NotificationService] Task dueDate:', task.dueDate, 'dueTime:', task.dueTime);
        console.log('[NotificationService] Parsed date (Brasilia):', formatBrasiliaDateTime(dueDate));
        console.log('[NotificationService] Current time (Brasilia):', formatBrasiliaDateTime(now));
        console.log('[NotificationService] Time until due (seconds):', secondsUntilDate(dueDate));

        // Validations
        if (isNaN(dueDate.getTime())) return [];

        // Helper to schedule
        const schedule = async (triggerDate: Date, title: string, body: string) => {
            if (triggerDate <= now) {
                console.log('[NotificationService] Skipping past notification:', title, 'trigger:', triggerDate.toLocaleString('pt-BR'));
                return; // Don't schedule in past
            }

            try {
                const secondsUntilTrigger = Math.floor((triggerDate.getTime() - now.getTime()) / 1000);

                console.log('[NotificationService] Scheduling:', title, 'in', secondsUntilTrigger, 'seconds');

                const id = await Notifications.scheduleNotificationAsync({
                    content: {
                        title,
                        body,
                        sound: true,
                        priority: Notifications.AndroidNotificationPriority.MAX,
                        data: {
                            taskId: task.id,
                            taskTitle: task.title,
                        },
                        categoryIdentifier: 'task-notification', // Enable action buttons
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                        seconds: secondsUntilTrigger,
                        channelId: 'default',
                    },
                });
                notificationIds.push(id);
            } catch (error) {
                console.error('[NotificationService] Error scheduling notification:', error);
            }
        };

        // 1. Exact Time
        await schedule(
            dueDate,
            'Tarefa Vencida',
            `A tarefa "${task.title}" venceu agora!`
        );

        // 2. 1 Hour Before
        const oneHourBefore = new Date(dueDate);
        oneHourBefore.setHours(oneHourBefore.getHours() - 1);
        await schedule(
            oneHourBefore,
            'Tarefa em 1 hora',
            `A tarefa "${task.title}" vence em 1 hora.`
        );

        // 3. 12 Hours Before
        const twelveHoursBefore = new Date(dueDate);
        twelveHoursBefore.setHours(twelveHoursBefore.getHours() - 12);
        await schedule(
            twelveHoursBefore,
            'Lembrete de Tarefa',
            `A tarefa "${task.title}" vence em 12 horas.`
        );

        return notificationIds;
    },

    /**
     * Cancela notificações de uma tarefa
     */
    async cancelTaskNotifications(notificationIds?: string[]): Promise<void> {
        if (!notificationIds || notificationIds.length === 0) return;

        for (const id of notificationIds) {
            try {
                await Notifications.cancelScheduledNotificationAsync(id);
            } catch (error) {
                console.log('[NotificationService] Notification ID might not exist:', id);
            }
        }
    },

    /**
     * Cancela todas as notificações agendadas
     */
    async cancelAll(): Promise<void> {
        await Notifications.cancelAllScheduledNotificationsAsync();
    },

    /**
     * Retorna todas as notificações agendadas (para debug)
     */
    async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
        return await Notifications.getAllScheduledNotificationsAsync();
    },

    /**
     * Reagenda notificações para todas as tarefas pendentes
     * Deve ser chamado quando o app inicia para garantir que as notificações existam
     */
    async rescheduleAllNotifications(tasks: Task[]): Promise<Record<string, string[]>> {
        // Skip on web
        if (Platform.OS === 'web') {
            return {};
        }

        console.log('[NotificationService] Rescheduling notifications for', tasks.length, 'tasks');

        // First, cancel all existing notifications to avoid duplicates
        await this.cancelAll();

        const notificationMap: Record<string, string[]> = {};

        for (const task of tasks) {
            // Skip completed non-recurring tasks
            if (task.completed && (!task.recurrence || task.recurrence === 'none')) {
                continue;
            }

            // Skip deleted tasks
            if (task.deletedAt) {
                continue;
            }

            try {
                const ids = await this.scheduleTaskNotifications(task);
                if (ids.length > 0) {
                    notificationMap[task.id] = ids;
                    console.log('[NotificationService] Scheduled', ids.length, 'notifications for task:', task.title);
                }
            } catch (error) {
                console.error('[NotificationService] Error scheduling notifications for task:', task.id, error);
            }
        }

        console.log('[NotificationService] Total tasks with notifications:', Object.keys(notificationMap).length);

        // Debug: Log all scheduled notifications
        const scheduled = await this.getScheduledNotifications();
        console.log('[NotificationService] Total scheduled notifications:', scheduled.length);

        return notificationMap;
    }
};

export default notificationService;
