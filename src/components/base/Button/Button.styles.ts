import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ButtonVariant, ButtonSize } from './Button.types';
import { Colors, BorderRadius } from '@src/styles';

/**
 * Cores base para as variantes de botão
 */
const VARIANT_COLORS: Record<ButtonVariant, { background: string; text: string; border?: string }> = {
    primary: {
        background: Colors.primary,
        text: Colors.white,
    },
    secondary: {
        background: Colors.secondary,
        text: Colors.white,
    },
    outline: {
        background: Colors.transparent,
        text: Colors.primary,
        border: Colors.primary,
    },
    ghost: {
        background: Colors.transparent,
        text: Colors.primary,
    },
    danger: {
        background: Colors.danger,
        text: Colors.white,
    },
};

/**
 * Dimensões para cada tamanho de botão
 */
const SIZE_DIMENSIONS: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number }> = {
    small: {
        height: 32,
        paddingHorizontal: 12,
        fontSize: 14,
    },
    medium: {
        height: 44,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    large: {
        height: 56,
        paddingHorizontal: 24,
        fontSize: 18,
    },
};

/**
 * Gera estilos dinâmicos baseados nas props
 * Segue o Open/Closed Principle (OCP) - aberto para extensão via props
 */
export const getButtonStyles = (
    variant: ButtonVariant = 'primary',
    size: ButtonSize = 'medium',
    fullWidth?: boolean,
    customColor?: string,
    disabled?: boolean
): { container: ViewStyle; text: TextStyle } => {
    const variantColor = VARIANT_COLORS[variant];
    const sizeConfig = SIZE_DIMENSIONS[size];

    const backgroundColor = customColor || variantColor.background;
    const textColor = variant === 'outline' || variant === 'ghost' ? variantColor.text : Colors.white;

    return {
        container: {
            height: sizeConfig.height,
            paddingHorizontal: sizeConfig.paddingHorizontal,
            backgroundColor: disabled ? Colors.light.borderLight : backgroundColor,
            borderRadius: BorderRadius.md,
            borderWidth: variant === 'outline' ? 1 : 0,
            borderColor: variantColor.border,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: fullWidth ? '100%' : 'auto',
            opacity: disabled ? 0.6 : 1,
        },
        text: {
            color: disabled ? Colors.light.textTertiary : textColor,
            fontSize: sizeConfig.fontSize,
            fontWeight: '600',
        },
    };
};

export const styles = StyleSheet.create({
    iconContainer: {
        marginHorizontal: 4,
    },
    loadingContainer: {
        marginRight: 8,
    },
});
