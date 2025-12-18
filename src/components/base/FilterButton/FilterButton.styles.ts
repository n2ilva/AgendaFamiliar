import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

/**
 * Gera estilos dinâmicos baseados nas props
 */
export const getFilterButtonStyles = (
    active: boolean = false,
    activeColor: string = '#007AFF',
    inactiveColor: string = '#F0F0F0',
    activeTextColor: string = '#FFFFFF',
    inactiveTextColor: string = '#666666',
    bordered: boolean = false
): {
    container: ViewStyle;
    text: TextStyle;
} => {
    return {
        container: {
            backgroundColor: active ? activeColor : inactiveColor,
            borderWidth: bordered ? 1 : 0,
            borderColor: active ? activeColor : '#E0E0E0',
        },
        text: {
            color: active ? activeTextColor : inactiveTextColor,
        },
    };
};

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    icon: {
        marginRight: 6,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
    },
    badge: {
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
});
