import React from 'react';
import { TouchableOpacity, View, Text, Switch, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SettingsOptionProps } from './SettingsOption.types';
import { styles } from './SettingsOption.styles';

/**
 * Componente SettingsOption reutilizável
 * 
 * Princípios SOLID aplicados:
 * - SRP: Responsabilidade única de renderizar uma opção de configuração
 * - OCP: Aberto para extensão via props e tipos
 * - ISP: Interface segregada
 * - DIP: Depende de abstrações
 * 
 * @example
 * ```tsx
 * <SettingsOption 
 *   title="Notificações"
 *   description="Receber notificações de tarefas"
 *   type="toggle"
 *   toggleValue={true}
 *   onToggleChange={(value) => setNotifications(value)}
 * />
 * ```
 */
export const SettingsOption: React.FC<SettingsOptionProps> = ({
    title,
    description,
    icon,
    type = 'navigation',
    toggleValue,
    onToggleChange,
    onPress,
    iconColor = '#007AFF',
    iconBackgroundColor = '#E6F4FE',
    loading = false,
    disabled = false,
    bordered = true,
    containerStyle,
    titleStyle,
    descriptionStyle,
}) => {
    const renderRightContent = () => {
        if (loading) {
            return <ActivityIndicator size="small" color="#007AFF" />;
        }

        if (type === 'toggle') {
            return (
                <Switch
                    value={toggleValue}
                    onValueChange={onToggleChange}
                    disabled={disabled}
                    trackColor={{ false: '#E0E0E0', true: '#34C759' }}
                    thumbColor="#FFFFFF"
                />
            );
        }

        if (type === 'navigation') {
            return (
                <Ionicons name="chevron-forward" size={20} style={styles.chevron} />
            );
        }

        return null;
    };

    const containerStyles = [
        styles.container,
        bordered && styles.bordered,
        disabled && styles.disabled,
        containerStyle,
    ];

    const content = (
        <>
            {icon && (
                <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
                    {icon}
                </View>
            )}

            <View style={styles.contentContainer}>
                <Text style={[styles.title, titleStyle]}>{title}</Text>
                {description && (
                    <Text style={[styles.description, descriptionStyle]}>
                        {description}
                    </Text>
                )}
            </View>

            <View style={styles.rightContainer}>
                {renderRightContent()}
            </View>
        </>
    );

    if (type === 'toggle' || disabled) {
        return <View style={containerStyles}>{content}</View>;
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={containerStyles}
            activeOpacity={0.7}
        >
            {content}
        </TouchableOpacity>
    );
};

export default SettingsOption;
