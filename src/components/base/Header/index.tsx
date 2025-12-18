import React from 'react';
import { View, Text } from 'react-native';
import { HeaderProps } from './Header.types';
import { getHeaderStyles, styles } from './Header.styles';

/**
 * Componente Header reutilizável
 * 
 * Princípios SOLID aplicados:
 * - SRP: Responsabilidade única de renderizar um header
 * - OCP: Aberto para extensão via props
 * - ISP: Interface segregada
 * - DIP: Depende de abstrações
 * 
 * @example
 * ```tsx
 * <Header 
 *   title="Minhas Tarefas"
 *   subtitle="5 tarefas pendentes"
 *   leftAction={<BackButton />}
 *   rightAction={<SettingsButton />}
 * />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    alignment = 'left',
    leftAction,
    rightAction,
    backgroundColor = '#FFFFFF',
    titleColor = '#000000',
    subtitleColor = '#666666',
    bordered = false,
    borderColor,
    containerStyle,
    titleStyle,
    subtitleStyle,
}) => {
    const dynamicStyles = getHeaderStyles(
        alignment,
        backgroundColor,
        titleColor,
        subtitleColor,
        bordered,
        borderColor
    );

    return (
        <View style={[styles.container, dynamicStyles.container, containerStyle]}>
            {leftAction && <View style={styles.leftAction}>{leftAction}</View>}

            <View style={styles.centerContent}>
                <Text style={[styles.title, dynamicStyles.title, titleStyle]}>
                    {title}
                </Text>
                {subtitle && (
                    <Text style={[styles.subtitle, dynamicStyles.subtitle, subtitleStyle]}>
                        {subtitle}
                    </Text>
                )}
            </View>

            {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
        </View>
    );
};

export default Header;
