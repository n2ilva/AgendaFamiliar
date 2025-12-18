import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) =>
    StyleSheet.create({
        badge: {
            position: 'absolute',
            top: -4,
            right: -6,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 4,
        },
        badgeText: {
            color: '#FFF',
            fontSize: 11,
            fontWeight: 'bold',
        },
    });
