import { StyleSheet, ViewStyle, Platform } from 'react-native';
import { CardElevation } from './Card.types';

/**
 * Configurações de sombra para cada nível de elevação
 */
const ELEVATION_SHADOWS: Record<CardElevation, ViewStyle> = {
    none: {},
    low: Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        android: {
            elevation: 2,
        },
    }) as ViewStyle,
    medium: Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
        },
        android: {
            elevation: 4,
        },
    }) as ViewStyle,
    high: Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
        },
        android: {
            elevation: 8,
        },
    }) as ViewStyle,
};

/**
 * Gera estilos dinâmicos baseados nas props
 */
export const getCardStyles = (
    elevation: CardElevation = 'low',
    backgroundColor: string = '#FFFFFF',
    padding: number = 16,
    borderRadius: number = 12,
    bordered?: boolean,
    borderColor?: string
): ViewStyle => {
    return {
        backgroundColor,
        padding,
        borderRadius,
        borderWidth: bordered ? 1 : 0,
        borderColor: borderColor || '#E0E0E0',
        ...ELEVATION_SHADOWS[elevation],
    };
};

export const styles = StyleSheet.create({
    pressableCard: {
        overflow: 'hidden',
    },
});
