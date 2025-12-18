import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import type { Task, RecurrenceType, Subtask } from '@types';
import { useTaskStore } from '@store/taskStore';
import { useUserStore } from '@store/userStore';

interface UseTaskFormProps {
  taskId?: string;
  onSuccess: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: Date;
  dueTime: Date | null;
  category: string;
  recurrence: RecurrenceType;
  subtasks: Subtask[];
}

/**
 * Custom hook to manage task form state and logic
 * Follows Single Responsibility Principle - only handles form logic
 */
export const useTaskForm = ({ taskId, onSuccess }: UseTaskFormProps) => {
  const { addTask, updateTask, getTaskById } = useTaskStore();
  const user = useUserStore((state) => state.user);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [dueTime, setDueTime] = useState<Date | null>(null);
  const [category, setCategory] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [loading, setLoading] = useState(false);

  // Load existing task if editing
  useEffect(() => {
    if (taskId) {
      const task = getTaskById(taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');

        // Parse date correctly
        // Parse date correctly from YYYY-MM-DD as local date
        const [year, month, day] = task.dueDate.split('-').map(Number);
        setDueDate(new Date(year, month - 1, day));

        if (task.dueTime) {
          const [hours, minutes] = task.dueTime.split(':').map(Number);
          const time = new Date();
          time.setHours(hours, minutes);
          setDueTime(time);
        }

        setCategory(task.category);
        setRecurrence(task.recurrence);
        setSubtasks(task.subtasks || []);
      }
    }
  }, [taskId, getTaskById]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Título da tarefa é obrigatório');
      return;
    }

    setLoading(true);
    try {
      // Format date as YYYY-MM-DD
      const year = dueDate.getFullYear();
      const month = String(dueDate.getMonth() + 1).padStart(2, '0');
      const day = String(dueDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      let formattedTime = undefined;
      if (dueTime) {
        const hours = String(dueTime.getHours()).padStart(2, '0');
        const minutes = String(dueTime.getMinutes()).padStart(2, '0');
        formattedTime = `${hours}:${minutes}`;
      }

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        dueDate: formattedDate,
        dueTime: formattedTime,
        category,
        recurrence,
        subtasks,
        completed: false,
        familyId: user?.familyId || '',
        createdBy: user?.uid || '',
      };

      if (taskId) {
        await updateTask(taskId, taskData);
      } else {
        await addTask(taskData as Task);
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Erro', 'Não foi possível salvar a tarefa');
    } finally {
      setLoading(false);
    }
  };

  const addSubtask = (subtaskTitle: string, subtaskCategory: string) => {
    if (!subtaskTitle.trim()) return;

    const newSubtask: Subtask = {
      id: Date.now().toString(),
      title: subtaskTitle.trim(),
      completed: false,
      category: subtaskCategory,
    };

    setSubtasks([...subtasks, newSubtask]);
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  return {
    // State
    title,
    description,
    dueDate,
    dueTime,
    category,
    recurrence,
    subtasks,
    loading,

    // Setters
    setTitle,
    setDescription,
    setDueDate,
    setDueTime,
    setCategory,
    setRecurrence,

    // Actions
    handleSave,
    addSubtask,
    removeSubtask,
  };
};
