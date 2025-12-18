import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@hooks/useThemeColors';
import { useTranslation } from 'react-i18next';
import { useCategoryStore } from '@store/categoryStore';
import { spacing, fontSize } from '@styles/spacing';
import { getCategoryLabel, getCategoryColor, CATEGORY_OPTIONS } from '@utils/taskUtils';
import type { RecurrenceType } from '@types';
import PickerModal from '@components/PickerModal';
import { useTaskForm } from '@hooks/useTaskForm';
import { TaskBasicInfo } from '@components/task-form/TaskBasicInfo';
import { TaskDateTime } from '@components/task-form/TaskDateTime';
import { TaskSubtasks } from '@components/task-form/TaskSubtasks';
import { RECURRENCE_LABELS } from '@constants/task';
import { CreateCategoryModal } from '@components/CreateCategoryModal';
import { useUserStore } from '@store/userStore';

const getRecurrenceOptions = (t: any) => [
  { label: t('recurrence.none'), value: 'none' },
  { label: t('recurrence.daily'), value: 'daily' },
  { label: t('recurrence.weekly'), value: 'weekly' },
  { label: t('recurrence.monthly'), value: 'monthly' },
  { label: t('recurrence.yearly'), value: 'yearly' },
];

export default function AddEditScreen({ route, navigation }: any) {
  const { t } = useTranslation();
  const { taskId } = route.params || { taskId: null };
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const user = useUserStore((state) => state.user);
  const { categories, addCategory } = useCategoryStore();
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showRecurrencePicker, setShowRecurrencePicker] = useState(false);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);

  const {
    title,
    description,
    dueDate,
    dueTime,
    category,
    recurrence,
    subtasks,
    loading,
    setTitle,
    setDescription,
    setDueDate,
    setDueTime,
    setCategory,
    setRecurrence,
    handleSave,
    addSubtask,
    removeSubtask,
  } = useTaskForm({
    taskId,
    onSuccess: () => navigation.goBack(),
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {taskId ? t('tasks.edit_task') : t('tasks.add_task')}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.headerButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons name="checkmark" size={24} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TaskBasicInfo
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
        />

        <TaskDateTime
          dueDate={dueDate}
          dueTime={dueTime}
          onDateChange={setDueDate}
          onTimeChange={setDueTime}
        />

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>{t('tasks.category')} *</Text>
          <TouchableOpacity
            style={[styles.categoryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowCategoryPicker(true)}
          >
            <View
              style={[
                styles.categoryDot,
                { backgroundColor: getCategoryColor(category) },
              ]}
            />
            <Text style={[styles.categoryText, { color: colors.text }]}>
              {t(`categories.${category}`, { defaultValue: getCategoryLabel(category) })}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Recurrence Selection */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>{t('tasks.recurrence')}</Text>
          <TouchableOpacity
            style={[styles.recurrenceButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowRecurrencePicker(true)}
          >
            <Ionicons name="repeat-outline" size={20} color={colors.primary} />
            <Text style={[styles.recurrenceText, { color: colors.text }]}>
              {t(`recurrence.${recurrence}`, { defaultValue: RECURRENCE_LABELS[recurrence] })}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TaskSubtasks
          subtasks={subtasks}
          onAdd={addSubtask}
          onRemove={removeSubtask}
        />
      </ScrollView>

      {/* Modals */}
      <PickerModal
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        title={t('tasks.select_category')}
        options={categories.map(cat => ({
          value: cat.id,
          label: t(`categories.${cat.id}`, { defaultValue: cat.label }),
          color: cat.color,
          icon: cat.icon,
        }))}
        onSelect={(value: string) => {
          setCategory(value);
        }}
        onCreate={() => setShowCreateCategoryModal(true)}
      />

      <PickerModal
        visible={showRecurrencePicker}
        onClose={() => setShowRecurrencePicker(false)}
        title={t('tasks.select_recurrence')}
        options={getRecurrenceOptions(t)}
        onSelect={(value: string) => {
          setRecurrence(value as RecurrenceType);
        }}
      />

      <CreateCategoryModal
        visible={showCreateCategoryModal}
        onClose={() => setShowCreateCategoryModal(false)}
        onSave={(name, icon, color) => {
          if (user?.familyId) {
            addCategory(name, icon, color, user.familyId);
          }
          setShowCreateCategoryModal(false);
        }}
      />
    </SafeAreaView>
  );
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
    },
    headerButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: fontSize.xl,
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    section: {
      marginBottom: spacing.lg,
    },
    label: {
      fontSize: fontSize.base,
      fontWeight: '600',
      marginBottom: spacing.sm,
    },
    categoryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 8,
      padding: spacing.md,
    },
    categoryDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: spacing.sm,
    },
    categoryText: {
      flex: 1,
      fontSize: fontSize.base,
    },
    recurrenceButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 8,
      padding: spacing.md,
    },
    recurrenceText: {
      flex: 1,
      fontSize: fontSize.base,
      marginLeft: spacing.sm,
    },
  });
