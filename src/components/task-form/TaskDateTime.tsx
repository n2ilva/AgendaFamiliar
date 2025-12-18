import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@hooks/useThemeColors';
import { spacing, fontSize } from '@styles/spacing';
import { formatDate } from '@utils/dateUtils';

interface TaskDateTimeProps {
  dueDate: Date;
  dueTime: Date | null;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: Date | null) => void;
}

/**
 * Component for date and time selection
 * Handles platform-specific date/time pickers
 */
export const TaskDateTime: React.FC<TaskDateTimeProps> = ({
  dueDate,
  dueTime,
  onDateChange,
  onTimeChange,
}) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      onTimeChange(selectedTime);
    }
  };

  const clearTime = () => {
    onTimeChange(null);
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: colors.text }]}>{t('tasks.due_date')} *</Text>
      <TouchableOpacity
        style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
        <Text style={[styles.dateText, { color: colors.text }]}>
          {formatDate(dueDate)}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <Text style={[styles.label, { color: colors.text }]}>{t('tasks.due_time')} ({t('common.optional', 'Opcional')})</Text>
      <View style={styles.timeRow}>
        <TouchableOpacity
          style={[styles.dateButton, styles.timeButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text style={[styles.dateText, { color: colors.text }]}>
            {dueTime
              ? `${String(dueTime.getHours()).padStart(2, '0')}:${String(dueTime.getMinutes()).padStart(2, '0')}`
              : t('tasks.no_time', 'Sem horário')}
          </Text>
        </TouchableOpacity>

        {dueTime && (
          <TouchableOpacity onPress={clearTime} style={styles.clearButton}>
            <Ionicons name="close-circle" size={24} color={colors.danger} />
          </TouchableOpacity>
        )}
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={dueTime || new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  dateText: {
    fontSize: fontSize.base,
    marginLeft: spacing.sm,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeButton: {
    flex: 1,
  },
  clearButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});
