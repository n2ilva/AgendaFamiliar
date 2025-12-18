import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { HeaderAlignment } from './Header.types';

/**
 * Gera estilos dinâmicos baseados nas props
 */
export const getHeaderStyles = (
    alignment: HeaderAlignment = 'left',
    backgroundColor: string = '#FFFFFF',
    titleColor: string = '#000000',
    subtitleColor: string = '#666666',
    bordered?: boolean,
    borderColor?: string
): {
    container: ViewStyle;
    title: TextStyle;
    subtitle: TextStyle;
} => {
    const textAlign = alignment;

    return {
        container: {
            backgroundColor,
            borderBottomWidth: bordered ? 1 : 0,
            borderBottomColor: borderColor || '#E0E0E0',
        },
        title: {
            color: titleColor,
            textAlign,
        },
        subtitle: {
            color: subtitleColor,
            textAlign,
        },
    };
};

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftAction: {
        marginRight: 12,
    },
    rightAction: {
        marginLeft: 12,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '400',
        marginTop: 2,
    },
});
