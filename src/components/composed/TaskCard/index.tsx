/**
 * TaskCard Component
 * 
 * Componente composto que representa um card de tarefa
 * Usa o componente base Card e segue princípios SOLID
 * 
 * @example
 * ```tsx
 * <TaskCard
 *   task={task}
 *   onPress={handleTaskPress}
 *   onToggle={handleToggle}
 *   detailed
 * />
 * ```
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@src/components/base';
import { useThemeColors } from '@hooks/useThemeColors';
import { createStyles } from './TaskCard.styles';
import type { TaskCardProps } from './TaskCard.types';

// Helper functions para data
const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
};

const isPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
};

const formatDate = (date: Date): string => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${date.getDate()} de ${months[date.getMonth()]}`;
};

export const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onPress,
    onToggle,
    onSkip,
    detailed = false,
    disabled = false,
}) => {
    const colors = useThemeColors();
    const styles = useMemo(() => createStyles(colors), [colors]);

    // Verifica se a tarefa está atrasada
    const isOverdue = useMemo(() => {
        if (task.completed || !task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return isPast(dueDate) && !isToday(dueDate);
    }, [task.completed, task.dueDate]);

    // Formata a data de vencimento
    const formattedDate = useMemo(() => {
        if (!task.dueDate) return '';
        const dueDate = new Date(task.dueDate);

        if (isToday(dueDate)) {
            return task.dueTime ? `Hoje às ${task.dueTime}` : 'Hoje';
        }

        return formatDate(dueDate);
    }, [task.dueDate, task.dueTime]);

    // Handler para toggle do checkbox
    const handleToggle = () => {
        if (!disabled && onToggle) {
            onToggle(task.id);
        }
    };

    // Handler para pressionar o card
    const handlePress = () => {
        if (!disabled && onPress) {
            onPress(task);
        }
    };

    // Handler para pular tarefa
    const handleSkip = () => {
        if (!disabled && onSkip) {
            onSkip(task.id);
        }
    };

    return (
        <View style={styles.container}>
            <Card
                elevation="low"
                pressable={!disabled && !!onPress}
                onPress={handlePress}
            >
                <View style={styles.content}>
                    {/* Checkbox */}
                    <TouchableOpacity
                        onPress={handleToggle}
                        disabled={disabled}
                        style={[
                            styles.checkbox,
                            task.completed && styles.checkboxChecked,
                            isOverdue && !task.completed && styles.checkboxOverdue,
                        ]}
                    >
                        {task.completed && (
                            <Ionicons name="checkmark" size={16} color={colors.white} />
                        )}
                    </TouchableOpacity>

                    {/* Conteúdo */}
                    <View style={styles.textContainer}>
                        {/* Título */}
                        <Text
                            style={[
                                styles.title,
                                task.completed && styles.titleCompleted,
                            ]}
                            numberOfLines={2}
                        >
                            {task.title}
                        </Text>

                        {/* Descrição (se detailed) */}
                        {detailed && task.description && (
                            <Text style={styles.subtitle} numberOfLines={2}>
                                {task.description}
                            </Text>
                        )}

                        {/* Detalhes */}
                        <View style={styles.detailsRow}>
                            {/* Data */}
                            {formattedDate && (
                                <View style={styles.detailItem}>
                                    <Ionicons
                                        name="calendar-outline"
                                        size={14}
                                        color={isOverdue ? colors.danger : colors.textTertiary}
                                    />
                                    <Text
                                        style={[
                                            styles.detailText,
                                            isOverdue && { color: colors.danger },
                                        ]}
                                    >
                                        {formattedDate}
                                    </Text>
                                </View>
                            )}

                            {/* Recorrência */}
                            {task.recurrence && task.recurrence !== 'none' && (
                                <View style={styles.detailItem}>
                                    <Ionicons
                                        name="repeat-outline"
                                        size={14}
                                        color={colors.textTertiary}
                                    />
                                    <Text style={styles.detailText}>
                                        {task.recurrence === 'daily' && 'Diária'}
                                        {task.recurrence === 'weekly' && 'Semanal'}
                                        {task.recurrence === 'monthly' && 'Mensal'}
                                        {task.recurrence === 'yearly' && 'Anual'}
                                    </Text>
                                </View>
                            )}

                            {/* Subtarefas */}
                            {detailed && task.subtasks && task.subtasks.length > 0 && (
                                <View style={styles.detailItem}>
                                    <Ionicons
                                        name="list-outline"
                                        size={14}
                                        color={colors.textTertiary}
                                    />
                                    <Text style={styles.detailText}>
                                        {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Categoria Badge */}
                        {detailed && task.category && (
                            <View
                                style={[
                                    styles.categoryBadge,
                                    { backgroundColor: (task.category as any)?.color || colors.primary },
                                ]}
                            >
                                <Text style={styles.categoryText}>
                                    {(task.category as any)?.label}
                                </Text>
                            </View>
                        )}

                        {/* Ações (Pular tarefa recorrente) */}
                        {task.recurrence && task.recurrence !== 'none' && onSkip && !task.completed && (
                            <View style={styles.actionsRow}>
                                <TouchableOpacity
                                    style={styles.skipButton}
                                    onPress={handleSkip}
                                    disabled={disabled}
                                >
                                    <Text style={styles.skipButtonText}>Pular</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Indicador de atraso */}
                    {isOverdue && <View style={styles.overdueIndicator} />}
                </View>
            </Card>
        </View>
    );
};

export default TaskCard;
