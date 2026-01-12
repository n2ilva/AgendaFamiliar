import { useThemeColors } from '@hooks/useThemeColors';
import RootNavigator from '@navigation/RootNavigator';
import SplashScreen from '@screens/SplashScreen';
import { auth, authService, notificationService, taskService } from '@src/firebase';
import { useCategoryStore } from '@store/categoryStore';
import { useTaskStore } from '@store/taskStore';
import { useUserStore } from '@store/userStore';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import i18n from 'i18next';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './src/config/i18n';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useUserStore((state) => state.setUser);
  const loadPreferences = useUserStore((state) => state.loadPreferences);
  const user = useUserStore((state) => state.user);
  const preferences = useUserStore((state) => state.preferences);
  const colors = useThemeColors();
  const initializeTasks = useTaskStore((state) => state.initialize);
  const initializeCategories = useCategoryStore((state) => state.initialize);
  const cleanupCategories = useCategoryStore((state) => state.cleanup);

  useEffect(() => {
    // Load saved preferences first
    loadPreferences();

    // Listen to Firebase Auth state changes
    console.log('[App] Setting up auth state listener...');
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: any) => {
      console.log('[App] Auth state changed:', firebaseUser ? `User: ${firebaseUser.email}` : 'No user');

      if (firebaseUser) {
        // User is signed in
        try {
          const user = await authService.getUserData(firebaseUser);
          console.log('[App] User data loaded:', user.email, 'FamilyID:', user.familyId);
          setUser(user);
        } catch (error) {
          console.error('[App] Error loading user data:', error);
          setUser(null);
        }
      } else {
        // User is signed out
        console.log('[App] User signed out');
        setUser(null);
      }

      // Finaliza o loading após verificar autenticação
      setIsLoading(false);
    });

    // Request notification permissions
    const setupNotifications = async () => {
      const granted = await notificationService.requestPermissions();
      console.log('[App] Notification permissions:', granted ? 'granted' : 'denied');

      if (!granted) {
        console.warn('[App] Notifications will not work without permissions!');
      }

      // Debug: Check scheduled notifications
      const scheduled = await notificationService.getScheduledNotifications();
      console.log('[App] Currently scheduled notifications:', scheduled.length);
    };
    setupNotifications();

    return () => {
      console.log('[App] Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user?.familyId) {
      const unsubscribe = initializeTasks();
      initializeCategories(user.familyId);

      return () => {
        unsubscribe();
        cleanupCategories();
      };
    }
  }, [user?.familyId]);

  // Handle notification actions (Complete/Skip)
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(async (response) => {
      const { actionIdentifier, notification } = response;
      const { taskId, taskTitle } = notification.request.content.data as { taskId: string; taskTitle: string };

      console.log('[App] Notification action:', actionIdentifier, 'for task:', taskId);

      if (!taskId) {
        console.warn('[App] Notification received without taskId');
        return;
      }

      console.log('[App] Action details:', { actionIdentifier, taskId, taskTitle });

      const { toggleTask, skipTask, tasks } = useTaskStore.getState();
      const currentUser = useUserStore.getState().user;

      console.log('[App] Current State:', { 
        hasTasks: tasks.length > 0, 
        hasUser: !!currentUser,
        userRole: currentUser?.role 
      });

      let task = tasks.find(t => t.id === taskId);

      // Se a tarefa não estiver no store (ex: app acabou de abrir pela notificação)
      // tentamos buscar diretamente do serviço
      if (!task) {
        console.log('[App] Task not found in store, fetching from service...');
        try {
          const fetchedTask = await taskService.getTaskById(taskId);
          if (fetchedTask) {
            task = fetchedTask;
            console.log('[App] Task fetched successfully:', task.title);
          }
        } catch (error) {
          console.error('[App] Error fetching task from service:', error);
        }
      }

      if (!task) {
        console.error('[App] Could not find task for notification action:', taskId);
        return;
      }

      // IMPORTANTE: Se o usuário não estiver carregado no Store ainda, 
      // precisamos esperar ou carregar. Em cold starts, o listener pode rodar antes do Auth.
      if (!currentUser) {
        console.log('[App] User not loaded yet, waiting 2 seconds for Auth...');
        // Simplificação: esperar um pouco. O ideal seria subscrever ao userStore.
        await new Promise(resolve => setTimeout(resolve, 2000));
        const retryUser = useUserStore.getState().user;
        if (!retryUser) {
          console.error('[App] User still not loaded after wait. Action aborted.');
          return;
        }
        console.log('[App] User loaded after wait:', retryUser.email);
      }

      try {
        if (actionIdentifier === 'complete') {
          console.log('[App] Executing Complete action...');
          // Mark task as completed (toggleTask handles recurrence)
          if (!task.completed) {
            await toggleTask(taskId);
            console.log('[App] Task completed via notification successfully');
          } else {
            console.log('[App] Task followed by "complete" was already completed.');
          }
        } else if (actionIdentifier === 'skip') {
          console.log('[App] Executing Skip action...');
          // Skip task (for recurring tasks)
          if (task.recurrence && task.recurrence !== 'none') {
            await skipTask(taskId);
            console.log('[App] Task skipped via notification successfully');
          } else {
            console.log('[App] Task followed by "skip" is not recurring.');
          }
        }
      } catch (error) {
        console.error('[App] Error handling notification action:', error);
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (preferences.language) {
      console.log('[App] Syncing i18n language:', preferences.language);
      i18n.changeLanguage(preferences.language);
    }
  }, [preferences.language]);

  // Mostra SplashScreen enquanto verifica autenticação
  if (isLoading) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
            <StatusBar style={preferences.theme === 'dark' ? 'light' : 'dark'} backgroundColor={colors.background} />
            <SplashScreen />
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
          <StatusBar style={preferences.theme === 'dark' ? 'light' : 'dark'} backgroundColor={colors.background} />
          <RootNavigator />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
