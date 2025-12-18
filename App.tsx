import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useThemeColors } from '@hooks/useThemeColors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RootNavigator from '@navigation/RootNavigator';
import { useUserStore } from '@store/userStore';
import { useTaskStore } from '@store/taskStore';
import { useCategoryStore } from '@store/categoryStore';
import { authService } from '@services/authService';
import { auth } from '@services/firebase';
import { notificationService } from '@services/notificationService';

export default function App() {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const preferences = useUserStore((state) => state.preferences);
  const colors = useThemeColors();
  const initializeTasks = useTaskStore((state) => state.initialize);
  const initializeCategories = useCategoryStore((state) => state.initialize);
  const cleanupCategories = useCategoryStore((state) => state.cleanup);

  useEffect(() => {
    // Listen to Firebase Auth state changes
    console.log('[App] Setting up auth state listener...');
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
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
    });

    // Request notification permissions
    notificationService.requestPermissions();

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
