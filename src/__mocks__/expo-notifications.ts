// Mock for expo-notifications
export const AndroidImportance = {
    DEFAULT: 3,
    HIGH: 4,
    LOW: 2,
    MAX: 5,
    MIN: 1,
    NONE: 0,
};

export const AndroidNotificationPriority = {
    DEFAULT: 0,
    HIGH: 1,
    LOW: -1,
    MAX: 2,
    MIN: -2,
};

export const SchedulableTriggerInputTypes = {
    TIME_INTERVAL: 'timeInterval',
    DATE: 'date',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
};

// Store scheduled notifications for testing
let scheduledNotifications: any[] = [];
let notificationIdCounter = 1;

export const setNotificationHandler = jest.fn();

export const setNotificationCategoryAsync = jest.fn().mockResolvedValue(undefined);

export const setNotificationChannelAsync = jest.fn().mockResolvedValue(undefined);

export const getPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' });

export const requestPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' });

export const scheduleNotificationAsync = jest.fn().mockImplementation(async (config: any) => {
    const id = `notification-${notificationIdCounter++}`;
    scheduledNotifications.push({ id, ...config });
    return id;
});

export const cancelScheduledNotificationAsync = jest.fn().mockImplementation(async (id: string) => {
    scheduledNotifications = scheduledNotifications.filter(n => n.id !== id);
});

export const cancelAllScheduledNotificationsAsync = jest.fn().mockImplementation(async () => {
    scheduledNotifications = [];
});

export const getAllScheduledNotificationsAsync = jest.fn().mockImplementation(async () => {
    return scheduledNotifications;
});

export const addNotificationResponseReceivedListener = jest.fn().mockReturnValue({
    remove: jest.fn(),
});

// Helper functions for tests
export const __getScheduledNotifications = () => scheduledNotifications;
export const __resetMock = () => {
    scheduledNotifications = [];
    notificationIdCounter = 1;
    jest.clearAllMocks();
};

export default {
    AndroidImportance,
    AndroidNotificationPriority,
    SchedulableTriggerInputTypes,
    setNotificationHandler,
    setNotificationCategoryAsync,
    setNotificationChannelAsync,
    getPermissionsAsync,
    requestPermissionsAsync,
    scheduleNotificationAsync,
    cancelScheduledNotificationAsync,
    cancelAllScheduledNotificationsAsync,
    getAllScheduledNotificationsAsync,
    addNotificationResponseReceivedListener,
    __getScheduledNotifications,
    __resetMock,
};
