import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { FilterButtonProps } from './FilterButton.types';
import { getFilterButtonStyles, styles } from './FilterButton.styles';

/**
 * Componente FilterButton reutilizável
 * 
 * Princípios SOLID aplicados:
 * - SRP: Responsabilidade única de renderizar um botão de filtro
 * - OCP: Aberto para extensão via props
 * - ISP: Interface segregada
 * - DIP: Depende de abstrações
 * 
 * @example
 * ```tsx
 * <FilterButton 
 *   label="Hoje"
 *   active={true}
 *   count={5}
 *   onPress={() => setFilter('today')}
 * />
 * ```
 */
export const FilterButton: React.FC<FilterButtonProps> = ({
    label,
    active = false,
    icon,
    count,
    activeColor = '#007AFF',
    inactiveColor = '#F0F0F0',
    activeTextColor = '#FFFFFF',
    inactiveTextColor = '#666666',
    onPress,
    containerStyle,
    textStyle,
    bordered = false,
}) => {
    const dynamicStyles = getFilterButtonStyles(
        active,
        activeColor,
        inactiveColor,
        activeTextColor,
        inactiveTextColor,
        bordered
    );

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, dynamicStyles.container, containerStyle]}
            activeOpacity={0.7}
        >
            {icon && <View style={styles.icon}>{icon}</View>}

            <Text style={[styles.text, dynamicStyles.text, textStyle]}>
                {label}
            </Text>

            {count !== undefined && count > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default FilterButton;
