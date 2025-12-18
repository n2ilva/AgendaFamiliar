import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Task } from '@types';
import { useThemeColors } from '@hooks/useThemeColors';
import { useTranslation } from 'react-i18next';
import { spacing, fontSize, fontWeight } from '@styles/spacing';
import { formatDate } from '@utils/dateUtils';
import { getCategoryColor, getCategoryLabel, getCategoryIcon } from '@utils/taskUtils';
import { useCategoryStore } from '@store/categoryStore';

interface TaskItemProps {
  task: Task;
  onPress: (task: Task) => void;
  onToggle: (taskId: string) => void;
  onSkip?: (taskId: string) => void;
  onSubtaskToggle?: (taskId: string, subtaskId: string) => void;
  onDelete?: (taskId: string) => void;
  isDeleted?: boolean;
}

export default function TaskItem({ task, onPress, onToggle, onSkip, onSubtaskToggle, onDelete, isDeleted }: TaskItemProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { categories } = useCategoryStore();

  // ... (existing helper functions) ...

  const groupSubtasksByCategory = (subtasks: Task['subtasks']) => {
    if (!subtasks || subtasks.length === 0) return {};
    const groups: { [key: string]: Task['subtasks'] } = {};
    subtasks.forEach((subtask) => {
      const cat = subtask.category || t('common.no_category', 'Sem Categoria');
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(subtask);
    });
    return groups;
  };

  const groupedSubtasks = groupSubtasksByCategory(task.subtasks);
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const categoryColor = getCategoryColor(task.category, categories);
  const categoryIcon = getCategoryIcon(task.category, categories);
  const isRecurring = task.recurrence && task.recurrence !== 'none';

  return (
    <View style={[
      styles.wrapper,
      { borderLeftColor: categoryColor, borderLeftWidth: 4, backgroundColor: colors.surface },
      isDeleted && { opacity: 0.5, backgroundColor: colors.background }
    ]}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => !isDeleted && onPress(task)}
        disabled={isDeleted}
      >
        {/* ... (existing Main Task Content) ... */}
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <View style={styles.categoryContainer}>
              <View style={[styles.categoryIconContainer, { backgroundColor: categoryColor }]}>
                <Ionicons name={categoryIcon as any} size={14} color="#fff" />
              </View>
              <Text style={[styles.categoryLabel, { color: categoryColor }]}>
                {getCategoryLabel(task.category, categories)}
              </Text>
            </View>
            {isDeleted && (
              <Text style={[styles.categoryLabel, { color: colors.danger, marginLeft: 8 }]}>
                {t('tasks.deleted', 'EXCLUÍDA')}
              </Text>
            )}
          </View>
          <View style={styles.mainRow}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                {
                  backgroundColor: task.completed ? colors.success : 'transparent',
                  borderColor: task.completed ? colors.success : colors.border,
                  borderWidth: 2,
                }
              ]}
              onPress={() => !isDeleted && onToggle(task.id)}
              disabled={isDeleted}
            >
              {task.completed && <Ionicons name="checkmark" size={16} color="#FFF" />}
            </TouchableOpacity>
            <View style={styles.content}>
              <Text style={[
                styles.title,
                { color: colors.text },
                (task.completed || isDeleted) && styles.titleCompleted
              ]} numberOfLines={1}>{task.title}</Text>
              {task.description ? <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={3}>{task.description}</Text> : null}
              <Text style={[styles.date, { color: colors.textSecondary }]}>
                {formatDate(task.dueDate)}
                {task.dueTime ? ` • ${task.dueTime}` : ''}
                {isRecurring && <Text style={[styles.recurrenceText, { color: colors.primary }]}>{' • '}{t(`recurrence.${task.recurrence}`)}</Text>}
              </Text>
            </View>
            {isRecurring && onSkip && !task.completed && !isDeleted && (
              <TouchableOpacity onPress={() => onSkip(task.id)} style={{ padding: 4 }}>
                <Ionicons name="play-skip-forward-outline" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
            {onDelete && !isDeleted && (
              <TouchableOpacity onPress={() => onDelete(task.id)} style={{ padding: 4, marginLeft: 4 }}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Subtasks Grouped Display */}
      {hasSubtasks && (
        <View style={[styles.subtasksContainer, { borderTopColor: colors.border }]}>
          {Object.entries(groupedSubtasks).map(([category, subtasks]) => (
            <View key={category} style={styles.subtaskGroup}>
              {category !== t('common.no_category', 'Sem Categoria') && category !== '' && (
                <Text style={[styles.subtaskCategoryHeader, { color: colors.primary }]}>{category}</Text>
              )}
              {subtasks.map((subtask) => (
                <View key={subtask.id} style={styles.subtaskRow}>
                  <TouchableOpacity
                    style={[
                      styles.subtaskCheckbox,
                      {
                        borderColor: subtask.completed ? colors.success : colors.border,
                        backgroundColor: subtask.completed ? colors.success : 'transparent'
                      }
                    ]}
                    onPress={() => !isDeleted && onSubtaskToggle && onSubtaskToggle(task.id, subtask.id)}
                    disabled={isDeleted}
                  >
                    {subtask.completed && <Ionicons name="checkmark" size={12} color="#FFF" />}
                  </TouchableOpacity>
                  <Text style={[
                    styles.subtaskText,
                    { color: colors.text },
                    (subtask.completed || isDeleted) && styles.titleCompleted
                  ]}>
                    {subtask.title}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    padding: spacing.md,
    overflow: 'hidden',
    // Shadow handles implicitly by native driver or ignored
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  container: {},
  contentContainer: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  categoryLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  description: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: fontSize.xs,
    marginBottom: 4,
  },
  recurrenceText: {
    fontWeight: '500',
  },
  subtasksContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  subtaskGroup: {
    marginBottom: spacing.sm,
  },
  subtaskCategoryHeader: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    marginBottom: 4,
    marginLeft: 32,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 32,
    marginBottom: 4,
  },
  subtaskCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtaskText: {
    fontSize: fontSize.sm,
  },
});
