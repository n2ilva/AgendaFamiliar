import { CreateCategoryModal } from '@components/CreateCategoryModal';
import PickerModal from '@components/PickerModal';
import { TaskBasicInfo } from '@components/task-form/TaskBasicInfo';
import { TaskDateTime } from '@components/task-form/TaskDateTime';
import { TaskSubtasks } from '@components/task-form/TaskSubtasks';
import { WeekDaysPicker } from '@components/task-form/WeekDaysPicker';
import { RECURRENCE_LABELS } from '@constants/task';
import { Ionicons } from '@expo/vector-icons';
import { useTaskForm } from '@hooks/useTaskForm';
import { useThemeColors } from '@hooks/useThemeColors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCategoryStore } from '@store/categoryStore';
import { useUserStore } from '@store/userStore';
import { fontSize, spacing } from '@styles/spacing';
import type { RecurrenceType } from '@types';
import { getCategoryColor, getCategoryLabel } from '@utils/taskUtils';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const getRecurrenceOptions = (t: any) => [
  { label: t('recurrence.none'), value: 'none' },
  { label: t('recurrence.daily'), value: 'daily' },
  { label: t('recurrence.weekly'), value: 'weekly' },
  { label: t('recurrence.monthly'), value: 'monthly' },
  { label: t('recurrence.yearly'), value: 'yearly' },
  { label: t('recurrence.custom_weekly', { defaultValue: 'Personalizado' }), value: 'custom_weekly' },
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
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const {
    title,
    description,
    dueDate,
    dueTime,
    category,
    recurrence,
    subtasks,
    isPrivate,
    loading,
    setTitle,
    setDescription,
    setDueDate,
    setDueTime,
    setCategory,
    setRecurrence,
    setIsPrivate,
    weekDays,
    setWeekDays,
    hasEndDate,
    setHasEndDate,
    recurrenceEndDate,
    setRecurrenceEndDate,
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
        {/* 1. Title and Description */}
        <TaskBasicInfo
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
        />

        {/* 2. Subtasks - Right after description for better UX */}
        <TaskSubtasks
          subtasks={subtasks}
          onAdd={addSubtask}
          onRemove={removeSubtask}
        />

        {/* 3. Date and Time */}
        <TaskDateTime
          dueDate={dueDate}
          dueTime={dueTime}
          onDateChange={setDueDate}
          onTimeChange={setDueTime}
        />

        {/* 4. Category Selection */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>{t('tasks.category')} *</Text>
          <TouchableOpacity
            style={[styles.categoryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowCategoryPicker(true)}
          >
            <View
              style={[
                styles.categoryDot,
                { backgroundColor: getCategoryColor(category, categories) },
              ]}
            />
            <Text style={[styles.categoryText, { color: colors.text }]}>
              {getCategoryLabel(category, categories)}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* 5. Recurrence Selection */}
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

          {/* Show WeekDaysPicker when custom_weekly is selected */}
          {recurrence === 'custom_weekly' && (
            <WeekDaysPicker
              selectedDays={weekDays}
              onDaysChange={setWeekDays}
            />
          )}

          {/* Recurrence End Date */}
          {recurrence !== 'none' && (
            <View style={styles.endDateContainer}>
              <View style={styles.endDateToggle}>
                <View style={styles.endDateLeft}>
                  <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                  <Text style={[styles.endDateLabel, { color: colors.text }]}>
                    Termina em
                  </Text>
                </View>
                <Switch
                  value={hasEndDate}
                  onValueChange={(value) => {
                    setHasEndDate(value);
                    if (value && !recurrenceEndDate) {
                      const defaultEnd = new Date();
                      defaultEnd.setMonth(defaultEnd.getMonth() + 1);
                      setRecurrenceEndDate(defaultEnd);
                    }
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFF"
                />
              </View>
              {hasEndDate && (
                Platform.OS === 'web' ? (
                  <View style={[styles.endDateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <input
                      type="date"
                      value={recurrenceEndDate
                        ? `${recurrenceEndDate.getFullYear()}-${(recurrenceEndDate.getMonth() + 1).toString().padStart(2, '0')}-${recurrenceEndDate.getDate().toString().padStart(2, '0')}`
                        : ''
                      }
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        if (e.target.value) {
                          const [y, m, d] = e.target.value.split('-').map(Number);
                          setRecurrenceEndDate(new Date(y, m - 1, d));
                        }
                      }}
                      style={{
                        flex: 1,
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: colors.text,
                        fontSize: 16,
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.endDateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Text style={[styles.endDateText, { color: colors.text }]}>
                      {recurrenceEndDate
                        ? `${recurrenceEndDate.getDate().toString().padStart(2, '0')}/${(recurrenceEndDate.getMonth() + 1).toString().padStart(2, '0')}/${recurrenceEndDate.getFullYear()}`
                        : 'Selecionar data'
                      }
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                )
              )}
              {showEndDatePicker && Platform.OS !== 'web' && (
                <DateTimePicker
                  value={recurrenceEndDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date()}
                  onChange={(event, date) => {
                    setShowEndDatePicker(Platform.OS === 'ios');
                    if (date) setRecurrenceEndDate(date);
                  }}
                />
              )}
            </View>
          )}
        </View>

        {/* 6. Private Task Toggle - Last option, only show if user has a family */}
        {user?.familyId && (
          <View style={styles.section}>
            <View style={styles.privateToggleContainer}>
              <View style={styles.privateToggleLeft}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
                <View style={styles.privateToggleText}>
                  <Text style={[styles.label, { color: colors.text, marginBottom: 2 }]}>
                    Tarefa Privada
                  </Text>
                  <Text style={[styles.privateToggleDescription, { color: colors.textSecondary }]}>
                    Apenas você pode ver esta tarefa
                  </Text>
                </View>
              </View>
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                trackColor={{
                  false: colors.border,
                  true: colors.primary,
                }}
                thumbColor="#FFF"
              />
            </View>
          </View>
        )}
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
    privateToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: spacing.md,
    },
    privateToggleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: spacing.sm,
    },
    privateToggleText: {
      flex: 1,
    },
    privateToggleDescription: {
      fontSize: fontSize.sm,
    },
    endDateContainer: {
      marginTop: spacing.md,
    },
    endDateToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: spacing.md,
    },
    endDateLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    endDateLabel: {
      fontSize: fontSize.base,
      fontWeight: '500',
    },
    endDateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderRadius: 8,
      padding: spacing.md,
      marginTop: spacing.sm,
    },
    endDateText: {
      fontSize: fontSize.base,
    },
  });
