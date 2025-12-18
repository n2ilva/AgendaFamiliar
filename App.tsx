import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useThemeColors } from '@hooks/useThemeColors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RootNavigator from '@navigation/RootNavigator';
import SplashScreen from '@screens/SplashScreen';
import { useUserStore } from '@store/userStore';
import { useTaskStore } from '@store/taskStore';
import { useCategoryStore } from '@store/categoryStore';
import { authService, auth, notificationService } from '@src/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import './src/config/i18n';
import i18n from 'i18next';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
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
