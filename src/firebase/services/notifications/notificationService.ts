import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Task } from '@types';

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
                        opensAppToForeground: false, // Não abre o app
                    },
                },
                {
                    identifier: 'skip',
                    buttonTitle: '⏭ Pular',
                    options: {
                        opensAppToForeground: false, // Não abre o app
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
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
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

        // Parse due date and time
        const [year, month, day] = task.dueDate.split('-').map(Number);

        // Default to 9 AM if no time specified, or use specified time
        let hours = 9;
        let minutes = 0;

        if (task.dueTime) {
            [hours, minutes] = task.dueTime.split(':').map(Number);
        }

        // Create date in LOCAL timezone (not UTC)
        // Using string format to ensure local timezone interpretation
        const dateString = `${task.dueDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
        const dueDate = new Date(dateString);
        const now = new Date();
        const notificationIds: string[] = [];

        // DEBUG: Log timezone info
        console.log('[NotificationService] Scheduling notifications for task:', task.title);
        console.log('[NotificationService] Task dueDate:', task.dueDate, 'dueTime:', task.dueTime);
        console.log('[NotificationService] Date string:', dateString);
        console.log('[NotificationService] Parsed date:', dueDate.toLocaleString('pt-BR'));
        console.log('[NotificationService] Parsed date ISO:', dueDate.toISOString());
        console.log('[NotificationService] Current time:', now.toLocaleString('pt-BR'));
        console.log('[NotificationService] Current time ISO:', now.toISOString());
        console.log('[NotificationService] Timezone offset (minutes):', now.getTimezoneOffset());
        console.log('[NotificationService] Time until due (hours):', (dueDate.getTime() - now.getTime()) / 1000 / 60 / 60);

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
                        data: {
                            taskId: task.id,
                            taskTitle: task.title,
                        },
                        categoryIdentifier: 'task-notification', // Enable action buttons
                    },
                    trigger: {
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
    }
};

export default notificationService;
