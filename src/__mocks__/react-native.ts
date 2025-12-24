// Mock for react-native
export const Platform = {
    OS: 'android',
    select: <T>(obj: { android?: T; ios?: T; default?: T }): T | undefined =>
        obj.android ?? obj.default,
};

export const Alert = {
    alert: jest.fn(),
};

export const StyleSheet = {
    create: <T>(styles: T): T => styles,
};

export default {
    Platform,
    Alert,
    StyleSheet,
};
