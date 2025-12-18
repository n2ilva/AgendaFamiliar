import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { ButtonProps } from './Button.types';
import { getButtonStyles, styles } from './Button.styles';

/**
 * Componente Button reutilizável
 * 
 * @example
 * ```tsx
 * <Button 
 *   title="Salvar" 
 *   variant="primary" 
 *   size="medium"
 *   onPress={() => console.log('Pressed')}
 * />
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'medium',
    leftIcon,
    rightIcon,
    loading = false,
    fullWidth = false,
    containerStyle,
    textStyle,
    customColor,
    disabled = false,
    onPress,
    ...touchableProps
}) => {
    const dynamicStyles = getButtonStyles(variant, size, fullWidth, customColor, disabled);

    return (
        <TouchableOpacity
            {...touchableProps}
            disabled={disabled || loading}
            onPress={onPress}
            style={[dynamicStyles.container, containerStyle]}
            activeOpacity={0.7}
        >
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="small"
                        color={variant === 'outline' || variant === 'ghost' ? '#007AFF' : '#FFFFFF'}
                    />
                </View>
            )}

            {!loading && leftIcon && (
                <View style={styles.iconContainer}>{leftIcon}</View>
            )}

            {title && (
                <Text style={[dynamicStyles.text, textStyle]}>
                    {title}
                </Text>
            )}

            {!loading && rightIcon && (
                <View style={styles.iconContainer}>{rightIcon}</View>
            )}
        </TouchableOpacity>
    );
};

export default Button;
