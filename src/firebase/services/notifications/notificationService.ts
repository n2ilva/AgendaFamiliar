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

        const dueDate = new Date(year, month - 1, day, hours, minutes);
        const now = new Date();
        const notificationIds: string[] = [];

        // Validations
        if (isNaN(dueDate.getTime())) return [];

        // Helper to schedule
        const schedule = async (triggerDate: Date, title: string, body: string) => {
            if (triggerDate <= now) return; // Don't schedule in past

            try {
                const id = await Notifications.scheduleNotificationAsync({
                    content: {
                        title,
                        body,
                        sound: true,
                        data: { taskId: task.id },
                    },
                    trigger: triggerDate as any,
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
