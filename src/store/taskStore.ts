import { create } from 'zustand';
import type { Task } from '@types';
import { notificationService, taskService, familyService } from '@src/firebase';
import { useUserStore } from '@store/userStore';
import { Alert } from 'react-native';
import { RecurrenceCalculator } from '@domain/services/RecurrenceCalculator';
import { RECURRENCE_TYPES } from '@constants/task';
import { filterVisibleTasks, convertTaskToPrivate, convertTaskToPublic } from '@utils/taskPermissions';

interface TaskStore {
  tasks: Task[];
  localNotificationMap: Record<string, string[]>;
  isLoading: boolean;
  toggleLock: Set<string>; // Lock to prevent double-toggle

  initialize: () => () => void;

  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  skipTask: (id: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;

  getTasks: () => Task[];
  getTaskById: (id: string) => Task | undefined;
  getTasksByDate: (date: string) => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  localNotificationMap: {},
  isLoading: false,
  toggleLock: new Set(),

  initialize: () => {
    set({ isLoading: true });
    const user = useUserStore.getState().user;

    if (!user || !user.familyId) {
      set({ tasks: [], isLoading: false });
      return () => { };
    }

    // Clean up old completed tasks (older than 7 days)
    // TEMPORARILY DISABLED: Requires proper Firestore permissions
    const cleanupOldCompletedTasks = async () => {
      if (!user.familyId) return; // Skip if no familyId

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString();

      try {
        const tasksToDelete = await taskService.getOldCompletedTasks(user.familyId, sevenDaysAgoStr);

        for (const task of tasksToDelete) {
          console.log(`[TaskStore] Auto-deleting old completed task: ${task.id} (completed: ${task.updatedAt})`);
          await taskService.deleteTask(task.id);
        }

        if (tasksToDelete.length > 0) {
          console.log(`[TaskStore] Cleaned up ${tasksToDelete.length} old completed tasks`);
        }
      } catch (error) {
        console.error('[TaskStore] Error cleaning up old completed tasks:', error);
      }
    };

    // Run cleanup on initialize
    // TODO: Re-enable after fixing Firestore permissions
    // cleanupOldCompletedTasks();

    const unsubscribe = taskService.subscribeToTasks(user.familyId, (firestoreTasks) => {
      const state = get();
      const currentUser = useUserStore.getState().user;

      // Filter tasks to only include visible ones (respects private tasks)
      const visibleTasks = filterVisibleTasks(firestoreTasks, currentUser);

      const mergedTasks = visibleTasks.map(t => ({
        ...t,
        notificationIds: state.localNotificationMap[t.id] || []
      }));

      set({ tasks: mergedTasks, isLoading: false });
    });
    return unsubscribe;
  },

  addTask: async (task: Task) => {
    const user = useUserStore.getState().user;
    if (!user || !user.familyId) return; // Should allow creation? Yes.

    const fullTask = {
      ...task,
      familyId: user.familyId,
      createdBy: user.uid
    };

    // 1. Schedule notifications (local only)
    const notificationIds = await notificationService.scheduleTaskNotifications(fullTask);

    set(state => ({
      localNotificationMap: { ...state.localNotificationMap }
    }));

    try {
      const createdTask = await taskService.createTask(fullTask);

      // 3. Now schedule with REAL ID
      const realNotificationIds = await notificationService.scheduleTaskNotifications(createdTask);

      set(state => ({
        localNotificationMap: {
          ...state.localNotificationMap,
          [createdTask.id]: realNotificationIds
        }
      }));
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    const user = useUserStore.getState().user;
    const currentTask = get().tasks.find(t => t.id === id);
    if (!currentTask || !user) return;

    // Handle privacy change: public -> private
    // When a public task becomes private, transfer ownership to current user
    let finalUpdates = { ...updates };

    if (updates.isPrivate === true && !currentTask.isPrivate) {
      // Converting public task to private: transfer ownership
      finalUpdates = convertTaskToPrivate(finalUpdates, user.uid);
      console.log(`[TaskStore] Converting task ${id} to private, transferring ownership to ${user.uid}`);
    } else if (updates.isPrivate === false && currentTask.isPrivate) {
      // Converting private task to public: keep current owner
      finalUpdates = convertTaskToPublic(finalUpdates);
      console.log(`[TaskStore] Converting task ${id} to public, keeping owner ${currentTask.createdBy}`);
    }

    // RBAC: Check Permissions
    if (user.role === 'dependent') {
      Alert.alert(
        'Aprovação Necessária',
        'Como dependente, sua alteração precisa ser aprovada pelo administrador.'
      );
      familyService.createApprovalRequest({
        familyId: user.familyId!,
        taskId: id,
        requestedBy: user.uid,
        userName: user.displayName || user.email,
        action: 'update',
        data: finalUpdates
      });
      return;
    }

    try {
      const needsReschedule = finalUpdates.dueDate || finalUpdates.dueTime || finalUpdates.title || finalUpdates.completed !== undefined;

      if (needsReschedule) {
        await notificationService.cancelTaskNotifications(currentTask.notificationIds);

        const updatedTask = { ...currentTask, ...finalUpdates } as Task;

        let newIds: string[] = [];
        if (!updatedTask.completed) {
          newIds = await notificationService.scheduleTaskNotifications(updatedTask);
        }

        set(state => ({
          localNotificationMap: {
            ...state.localNotificationMap,
            [id]: newIds
          }
        }));
      }

      await taskService.updateTask(id, finalUpdates);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  },

  deleteTask: async (id: string) => {
    console.log('deleteTask called with id:', id);
    const user = useUserStore.getState().user;
    const task = get().tasks.find(t => t.id === id);

    console.log('User:', user?.uid, 'Task found:', !!task);

    if (!task || !user) {
      console.log('Early return: task or user not found');
      return;
    }

    // RBAC
    if (user.role === 'dependent') {
      Alert.alert(
        'Aprovação Necessária',
        'Solicitação de exclusão enviada ao administrador.'
      );
      familyService.createApprovalRequest({
        familyId: user.familyId!,
        taskId: id,
        requestedBy: user.uid,
        userName: user.displayName || user.email,
        action: 'delete',
        data: {}
      });
      return;
    }

    console.log('Canceling notifications...');
    if (task.notificationIds) {
      await notificationService.cancelTaskNotifications(task.notificationIds);
    }

    set(state => {
      const newMap = { ...state.localNotificationMap };
      delete newMap[id];
      return { localNotificationMap: newMap };
    });

    console.log('Calling taskService.deleteTask...');
    await taskService.deleteTask(id);
    console.log('Task deleted (soft delete)');
  },

  toggleTask: async (id: string) => {
    try {
      console.log('toggleTask called with id:', id);

      // Check if already processing this task
      const state = get();
      if (state.toggleLock.has(id)) {
        console.log('Task toggle already in progress, ignoring duplicate call');
        return;
      }

      // Acquire lock
      set(s => ({ toggleLock: new Set([...s.toggleLock, id]) }));

      const user = useUserStore.getState().user;
      const task = state.tasks.find(t => t.id === id);

      console.log('User:', user?.uid, 'Task found:', !!task);

      if (!task || !user) {
        console.log('Early return: task or user not found');
        // Release lock
        set(s => {
          const newLock = new Set(s.toggleLock);
          newLock.delete(id);
          return { toggleLock: newLock };
        });
        return;
      }

      // RBAC
      if (user.role === 'dependent') {
        // Allow toggle? User said "conclude... needs approval".
        // So yes, verify role.
        Alert.alert(
          'Aprovação Necessária',
          'Solicitação de conclusão/alteração enviada ao administrador.'
        );
        const action = !task.completed ? 'complete' : 'update'; // If completing, action is complete. If undoing, it's update?
        // Actually, let's treat toggle as 'complete' request if completing, or 'update' if uncompleting.
        // Simplification: 'update' with { completed: !completed } data covers it.
        familyService.createApprovalRequest({
          familyId: user.familyId!,
          taskId: id,
          requestedBy: user.uid,
          userName: user.displayName || user.email,
          action: 'update',
          data: { completed: !task.completed }
        });
        // Release lock
        set(s => {
          const newLock = new Set(s.toggleLock);
          newLock.delete(id);
          return { toggleLock: newLock };
        });
        return;
      }

      const isCompleting = !task.completed;
      console.log('isCompleting:', isCompleting);

      // CRITICAL: Don't reschedule deleted tasks
      if (task.deletedAt) {
        console.log('Task is deleted, skipping toggle');
        // Release lock
        set(s => {
          const newLock = new Set(s.toggleLock);
          newLock.delete(id);
          return { toggleLock: newLock };
        });
        return;
      }

      // Handle recurrence
      if (isCompleting && RecurrenceCalculator.shouldRecur(task.recurrence)) {
        console.log('Handling recurring task');

        // Use RecurrenceCalculator for clean, testable logic
        const formattedDate = RecurrenceCalculator.calculateNextDate(task.dueDate, task.recurrence);

        console.log('Current task date:', task.dueDate);
        console.log('Next date calculated:', formattedDate);

        await notificationService.cancelTaskNotifications(task.notificationIds);

        const updates = {
          dueDate: formattedDate,
          completed: false, // Ensure false
          subtasks: task.subtasks.map(s => ({ ...s, completed: false })), // Reset subtasks
        };

        console.log('Updating recurring task with:', updates);
        await taskService.updateTask(id, updates);
        console.log('Recurring task updated, new date:', formattedDate);

        const nextTaskState = { ...task, ...updates, updatedAt: new Date().toISOString() };
        const newIds = await notificationService.scheduleTaskNotifications(nextTaskState);

        set(state => ({
          localNotificationMap: {
            ...state.localNotificationMap,
            [id]: newIds
          }
        }));

      } else {
        console.log('Handling non-recurring task toggle');
        await notificationService.cancelTaskNotifications(task.notificationIds);

        console.log('Updating task with completed:', isCompleting);
        await taskService.updateTask(id, {
          completed: isCompleting
        });
        console.log('Task updated successfully');

        if (!isCompleting) {
          const newIds = await notificationService.scheduleTaskNotifications({ ...task, completed: false });
          set(state => ({
            localNotificationMap: {
              ...state.localNotificationMap,
              [id]: newIds
            }
          }));
        }
      }

      // Release lock
      set(s => {
        const newLock = new Set(s.toggleLock);
        newLock.delete(id);
        return { toggleLock: newLock };
      });

    } catch (error) {
      console.error('Error in toggleTask:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa');

      // Release lock on error
      set(s => {
        const newLock = new Set(s.toggleLock);
        newLock.delete(id);
        return { toggleLock: newLock };
      });
    }
  },

  toggleSubtask: async (taskId: string, subtaskId: string) => {
    // NOTE: Subtask toggle logic is complex with approvals if it triggers parent completion.
    // For MVP, if dependent toggles subtask, do we require approval?
    // "dependent needs approval to conclude, alter or delete a task".
    // Subtask is part of task. So YES.
    // We'll treat subtask toggle as 'update'.

    const user = useUserStore.getState().user;
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || !user) return;

    const updatedSubtasks = task.subtasks.map((sub) =>
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    );

    if (user.role === 'dependent') {
      Alert.alert('Aprovação Necessária', 'Alteração de subtarefa enviada para aprovação.');
      familyService.createApprovalRequest({
        familyId: user.familyId!,
        taskId: taskId,
        requestedBy: user.uid,
        userName: user.displayName || user.email,
        action: 'update',
        data: { subtasks: updatedSubtasks }
      });
      return;
    }

    // ... (Existing Admin logic) ...
    const allSubtasksCompleted = updatedSubtasks.every((s) => s.completed);

    if (allSubtasksCompleted && !task.completed) {
      const isCompleting = true;
      let updates: Partial<Task> = { subtasks: updatedSubtasks };

      if (task.recurrence && task.recurrence !== 'none') {
        const nextDate = new Date(task.dueDate);
        switch (task.recurrence) {
          case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
          case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
          case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
          case 'yearly': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
        }
        const year = nextDate.getFullYear();
        const month = String(nextDate.getMonth() + 1).padStart(2, '0');
        const day = String(nextDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        await notificationService.cancelTaskNotifications(task.notificationIds);

        updates.dueDate = formattedDate;
        updates.completed = false;
        updates.subtasks = updatedSubtasks.map(s => ({ ...s, completed: false }));

        await taskService.updateTask(taskId, updates);

        const nextTaskState = { ...task, ...updates } as Task;
        const newIds = await notificationService.scheduleTaskNotifications(nextTaskState);

        set(state => ({
          localNotificationMap: { ...state.localNotificationMap, [taskId]: newIds }
        }));

      } else {
        await notificationService.cancelTaskNotifications(task.notificationIds);
        updates.completed = true;
        await taskService.updateTask(taskId, updates);
        set(state => {
          const newMap = { ...state.localNotificationMap };
          delete newMap[taskId];
          return { localNotificationMap: newMap };
        });
      }
    } else {
      await taskService.updateTask(taskId, { subtasks: updatedSubtasks });
    }
  },

  skipTask: async (id: string) => {
    console.log('skipTask called with id:', id);
    const user = useUserStore.getState().user;
    const task = get().tasks.find(t => t.id === id);

    console.log('Task found:', !!task, 'Recurrence:', task?.recurrence);

    if (!task || !task.recurrence || task.recurrence === 'none') {
      console.log('Early return: task not found or not recurring');
      return;
    }

    // CRITICAL: Don't reschedule deleted tasks
    if (task.deletedAt) {
      console.log('Task is deleted, cannot skip');
      Alert.alert('Erro', 'Não é possível pular uma tarefa excluída');
      return;
    }

    if (user?.role === 'dependent') {
      Alert.alert('Aprovação Necessária', 'Pular tarefa requer aprovação.');

      // Use RecurrenceCalculator
      const formattedDate = RecurrenceCalculator.calculateNextDate(task.dueDate, task.recurrence);

      familyService.createApprovalRequest({
        familyId: user!.familyId!,
        taskId: id,
        requestedBy: user!.uid,
        userName: user!.displayName || user!.email,
        action: 'update',
        data: {
          dueDate: formattedDate,
          completed: false,
          subtasks: task.subtasks.map(s => ({ ...s, completed: false })),
        }
      });
      return;
    }

    // Use RecurrenceCalculator for clean, testable logic
    const formattedDate = RecurrenceCalculator.calculateNextDate(task.dueDate, task.recurrence);

    console.log('Current task date:', task.dueDate);
    console.log('Next date calculated (skip):', formattedDate);

    await notificationService.cancelTaskNotifications(task.notificationIds);

    const updates = {
      dueDate: formattedDate,
      completed: false,
      subtasks: task.subtasks.map(s => ({ ...s, completed: false })),
    };

    console.log('Updating task with skip:', updates);
    await taskService.updateTask(id, updates);
    console.log('Task skipped successfully');


    const nextTaskState = { ...task, ...updates, updatedAt: new Date().toISOString() };
    const newIds = await notificationService.scheduleTaskNotifications(nextTaskState);

    set((state) => ({
      localNotificationMap: {
        ...state.localNotificationMap,
        [id]: newIds
      }
    }));
  },

  cleanupOldTasks: () => { },// Handled by Admin logic ideally

  getTasks: () => {
    const tasks = get().tasks;
    return tasks.filter(t => !t.deletedAt);
  },
  getTaskById: (id: string) => get().tasks.find((task) => task.id === id),
  getTasksByDate: (date: string) => {
    const tasks = get().tasks;
    const targetDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = targetDate.getTime() === today.getTime();

    return tasks.filter((task) => {
      // If deleted, only show if it was deleted ON this date? 
      // Or maybe we want to show deleted tasks in history?
      // User asked: "visualizar as tarefas excluidas, pelo menos na visualizacao da aba calendario, no dia selecionado mostrar tarefas concluidas, ativas, vencidas e excluidas"

      // So we include deleted tasks if they match the date.
      // But wait, if a task was created/due on date X and deleted on date Y, where should it show?
      // Usually on date X (due date).

      const matchesDate = task.dueDate === date;

      if (task.deletedAt) {
        return matchesDate;
      }

      // If active (not deleted)
      if (matchesDate) return true;

      // If today, also show overdue tasks that are not completed
      if (isToday && !task.completed && task.dueDate < date) {
        return true;
      }

      return false;
    });
  },
}));
