import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTaskStore } from '@store/taskStore';
import { useUserStore } from '@store/userStore';
import TaskItem from '@components/TaskItem';
import { useThemeColors } from '@hooks/useThemeColors';
import { createStyles } from './CalendarScreen.styles';
import type { Task } from '@types';

export default function CalendarScreen({ navigation }: any) {
  const { t, i18n } = useTranslation();
  const { tasks } = useTaskStore();
  const { preferences } = useUserStore();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);


  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const getMarkedDates = () => {
    const marked: any = {};

    tasks.forEach((task) => {
      const dateStr = task.dueDate;
      if (!marked[dateStr]) {
        marked[dateStr] = { marked: true, dots: [] };
      }

      marked[dateStr].dots.push({
        key: task.id,
        color: task.completed ? colors.success : colors.primary,
      });
    });

    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: colors.primary,
    };

    return marked;
  };

  const selectedDateTasks = tasks.filter(
    (task) => task.dueDate === selectedDate
  );

  const handleEditTask = (task: Task) => {
    navigation.navigate('AddEdit', { taskId: task.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            key={preferences.theme} // Force re-render on theme change
            current={selectedDate}
            markedDates={getMarkedDates()}
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            monthFormat={'MMMM yyyy'}
            hideArrows={false}
            hideDayNames={false}
            disableMonthChange={false}
            enableSwipeMonths={true}
            theme={{
              backgroundColor: colors.background,
              calendarBackground: colors.surface,
              textSectionTitleColor: colors.text,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#FFF',
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.textSecondary,
              dotColor: colors.primary,
              selectedDotColor: '#FFF',
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              textDayFontFamily: 'System',
              textMonthFontSize: 16,
              textMonthFontWeight: 'bold',
              textDayHeaderFontSize: 12,
            }}
          />
        </View>

        {/* Selected Date Tasks */}
        <View style={styles.tasksSection}>
          <View style={styles.tasksHeader}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.tasksTitle}>
              {(() => {
                const [y, m, d] = selectedDate.split('-').map(Number);
                const locale = i18n.language === 'en' ? 'en-US' : 'pt-BR';
                return new Date(y, m - 1, d).toLocaleDateString(locale, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                });
              })()}
            </Text>
          </View>

          {selectedDateTasks.length === 0 ? (
            <View style={styles.emptyTasks}>
              <Ionicons
                name="checkmark-done-outline"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>{t('calendar.no_tasks_day')}</Text>
            </View>
          ) : (
            <FlatList
              data={selectedDateTasks}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TaskItem
                  task={item}
                  onPress={handleEditTask}
                  onToggle={(taskId) => useTaskStore.getState().toggleTask(taskId)}
                  onSubtaskToggle={(taskId, subtaskId) => useTaskStore.getState().toggleSubtask(taskId, subtaskId)}
                  onDelete={(taskId) => useTaskStore.getState().deleteTask(taskId)}
                  isDeleted={!!item.deletedAt}
                />
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

