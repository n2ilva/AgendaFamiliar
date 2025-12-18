import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CardProps } from './Card.types';
import { getCardStyles, styles } from './Card.styles';

/**
 * Componente Card reutilizável
 * 
 * Princípios SOLID aplicados:
 * - SRP: Responsabilidade única de renderizar um card
 * - OCP: Aberto para extensão via props
 * - LSP: Pode ser usado como View ou TouchableOpacity
 * - ISP: Interface segregada
 * - DIP: Depende de abstrações
 * 
 * @example
 * ```tsx
 * <Card elevation="medium" pressable onPress={() => {}}>
 *   <Text>Conteúdo do card</Text>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
    children,
    elevation = 'low',
    backgroundColor = '#FFFFFF',
    padding = 16,
    borderRadius = 12,
    pressable = false,
    onPress,
    containerStyle,
    bordered = false,
    borderColor,
    ...touchableProps
}) => {
    const dynamicStyles = getCardStyles(
        elevation,
        backgroundColor,
        padding,
        borderRadius,
        bordered,
        borderColor
    );

    if (pressable && onPress) {
        return (
            <TouchableOpacity
                {...touchableProps}
                onPress={onPress}
                style={[dynamicStyles, styles.pressableCard, containerStyle]}
                activeOpacity={0.8}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={[dynamicStyles, containerStyle]}>
            {children}
        </View>
    );
};

export default Card;
