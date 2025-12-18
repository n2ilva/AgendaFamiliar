import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
  Alert,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';
import { useTaskStore } from '@store/taskStore';
import TaskItem from '@components/TaskItem';
import { useThemeColors } from '@hooks/useThemeColors';
import { useLoadingState } from '@hooks/useLoadingState';
import { createStyles } from './HomeScreen.styles';
import type { Task } from '@types';
import { CATEGORY_OPTIONS, hexToRGBA } from '@utils/taskUtils';

export default function HomeScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { tasks, deleteTask, toggleTask, skipTask, toggleSubtask, getTasks } =
    useTaskStore();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { loading, setLoading, refreshing, setRefreshing } = useLoadingState();

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<Task['category'] | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'overdue' | 'completed'>('pending');

  // Tab navigation state
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'today', title: t('tasks.today') },
    { key: 'upcoming', title: t('tasks.upcoming') },
  ]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    setLoading(true);
    try {
      getTasks();
    } catch (error) {
      Alert.alert(t('common.error'), t('tasks.load_error', 'Não foi possível carregar as tarefas'));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getTasks();
    } catch (error) {
      Alert.alert(t('common.error'), t('tasks.update_error', 'Não foi possível atualizar as tarefas'));
    } finally {
      setRefreshing(false);
    }
  };

  const handleEditTask = (task: Task) => {
    navigation.navigate('AddEdit', { taskId: task.id });
  };

  const handleDeleteTask = (taskId: string) => {
    console.log('handleDeleteTask called with taskId:', taskId);

    // On web, confirm() works better than Alert.alert
    if (Platform.OS === 'web') {
      if (window.confirm(t('tasks.delete_confirm_msg'))) {
        console.log('User confirmed delete on web');
        deleteTask(taskId);
      }
      return;
    }

    Alert.alert(
      t('tasks.delete_confirm_title'),
      t('tasks.delete_confirm_msg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            console.log('User confirmed delete on native');
            deleteTask(taskId);
          },
        },
      ]
    );
  };

  const handleSkipTask = (taskId: string) => {
    Alert.alert(
      t('tasks.skip_confirm_title'),
      t('tasks.skip_confirm_msg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('tasks.skip'),
          style: 'default',
          onPress: () => skipTask(taskId),
        },
      ]
    );
  };

  // Get filtered tasks based on current tab
  const getFilteredTasks = useCallback((dateFilter: 'today' | 'upcoming') => {
    return tasks.filter((t) => {
      const todayStr = new Date().toISOString().split('T')[0];

      // 0. Exclude deleted tasks
      if (t.deletedAt) return false;

      // 1. Status Filter
      if (selectedStatus === 'completed') {
        if (!t.completed) return false;
        // Only show completed tasks from last 31 days
        if (t.updatedAt) {
          const thirtyOneDaysAgo = new Date();
          thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);
          const updatedDate = t.updatedAt.split('T')[0];
          const thirtyOneDaysAgoStr = thirtyOneDaysAgo.toISOString().split('T')[0];
          if (updatedDate < thirtyOneDaysAgoStr) return false;
        }
      } else if (selectedStatus === 'overdue') {
        if (t.completed) return false;
        if (t.dueDate >= todayStr) return false;
      } else { // pending
        if (t.completed) return false;
        if (t.dueDate < todayStr) return false;
      }

      // 2. Category Filter
      if (selectedCategory && t.category !== selectedCategory) return false;

      // 3. Date Filter
      if (dateFilter === 'today') {
        const isOverdue = t.dueDate < todayStr && !t.completed;
        if (t.dueDate !== todayStr && !isOverdue) return false;
      } else if (dateFilter === 'upcoming') {
        if (t.dueDate <= todayStr) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort by date: nearest first
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [tasks, selectedStatus, selectedCategory]);

  const todayTasks = useMemo(() => getFilteredTasks('today'), [getFilteredTasks]);
  const upcomingTasks = useMemo(() => getFilteredTasks('upcoming'), [getFilteredTasks]);

  // Calculate counts for status buttons
  const todayStr = new Date().toISOString().split('T')[0];
  const thirtyOneDaysAgo = new Date();
  thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);
  const thirtyOneDaysAgoStr = thirtyOneDaysAgo.toISOString().split('T')[0];

  // Completed: only tasks completed in the last 31 days
  const completedCount = tasks.filter((t) => {
    if (!t.completed || t.deletedAt) return false;
    // Check if task was completed in the last 31 days
    if (t.updatedAt) {
      const updatedDate = t.updatedAt.split('T')[0];
      return updatedDate >= thirtyOneDaysAgoStr;
    }
    return true; // Include if no updatedAt (legacy tasks)
  }).length;

  // Pending: active tasks (not deleted, not completed) with future or today's date
  const pendingCount = tasks.filter(t =>
    !t.completed && !t.deletedAt && t.dueDate >= todayStr
  ).length;

  // Overdue: active tasks (not deleted, not completed) with past date
  const overdueCount = tasks.filter(t =>
    !t.completed && !t.deletedAt && t.dueDate < todayStr
  ).length;

  // Render task list for a tab
  const renderTaskList = (taskList: Task[]) => (
    <FlatList
      data={taskList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onPress={handleEditTask}
          onToggle={toggleTask}
          onSkip={handleSkipTask}
          onSubtaskToggle={toggleSubtask}
          onDelete={handleDeleteTask}
        />
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-done-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            {t('tasks.no_tasks')}
          </Text>
          <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
            {index === 0 ? t('tasks.no_tasks_today') : t('tasks.no_tasks_upcoming')}
          </Text>
        </View>
      }
    />
  );

  // Tab scenes
  const TodayRoute = () => renderTaskList(todayTasks);
  const UpcomingRoute = () => renderTaskList(upcomingTasks);

  const renderScene = SceneMap({
    today: TodayRoute,
    upcoming: UpcomingRoute,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary, height: 3 }}
      style={{ backgroundColor: colors.background, elevation: 0, shadowOpacity: 0 }}
      labelStyle={{ fontWeight: '600', textTransform: 'none', fontSize: 16 }}
      activeColor={colors.primary}
      inactiveColor={colors.textSecondary}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Status Tabs */}
      <View style={styles.statsContainer}>
        {/* Pending */}
        <TouchableOpacity
          style={[
            styles.statBox,
            {
              backgroundColor: selectedStatus === 'pending' ? colors.primary : colors.surface,
            },
          ]}
          onPress={() => setSelectedStatus('pending')}
        >
          <Text
            style={[
              styles.statNumber,
              { color: selectedStatus === 'pending' ? '#FFF' : colors.text },
            ]}
          >
            {pendingCount}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: selectedStatus === 'pending' ? '#FFF' : colors.textSecondary },
            ]}
          >
            {t('tasks.pending')}
          </Text>
        </TouchableOpacity>

        {/* Overdue */}
        <TouchableOpacity
          style={[
            styles.statBox,
            {
              backgroundColor: selectedStatus === 'overdue' ? colors.danger : colors.surface,
            },
          ]}
          onPress={() => setSelectedStatus('overdue')}
        >
          <Text
            style={[
              styles.statNumber,
              { color: selectedStatus === 'overdue' ? '#FFF' : colors.text },
            ]}
          >
            {overdueCount}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: selectedStatus === 'overdue' ? '#FFF' : colors.textSecondary },
            ]}
          >
            {t('tasks.overdue')}
          </Text>
        </TouchableOpacity>

        {/* Completed */}
        <TouchableOpacity
          style={[
            styles.statBox,
            {
              backgroundColor: selectedStatus === 'completed' ? colors.success : colors.surface,
            },
          ]}
          onPress={() => setSelectedStatus('completed')}
        >
          <Text
            style={[
              styles.statNumber,
              { color: selectedStatus === 'completed' ? '#FFF' : colors.text },
            ]}
          >
            {completedCount}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: selectedStatus === 'completed' ? '#FFF' : colors.textSecondary },
            ]}
          >
            {t('tasks.completed')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ label: t('common.all'), value: null }, ...CATEGORY_OPTIONS]}
          keyExtractor={(item) => item.value || 'all'}
          contentContainerStyle={styles.filterContent}
          renderItem={({ item }) => {
            const color = (item as any).color || colors.primary;
            const icon = (item as any).icon || 'layers-outline';
            const isSelected = selectedCategory === item.value;

            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? color : colors.surface,
                    borderColor: color,
                  },
                ]}
                onPress={() => setSelectedCategory(item.value)}
              >
                <Ionicons
                  name={icon}
                  size={16}
                  color={isSelected ? '#FFF' : color}
                />
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: isSelected ? '#FFF' : colors.text,
                      marginLeft: 6,
                    },
                  ]}
                >
                  {t(`categories.${item.value}`, { defaultValue: item.label })}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Swipeable TabView */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AddEdit')}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}
