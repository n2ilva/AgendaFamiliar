import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, Preferences } from '@types';

interface UserStore {
  user: User | null;
  preferences: Preferences;
  setUser: (user: User | null) => void;
  setPreferences: (preferences: Partial<Preferences>) => void;
  loadPreferences: () => Promise<void>;
  logout: () => void;
}

const defaultPreferences: Preferences = {
  theme: 'light',
  language: 'pt-BR',
  notifications: true,
};

const PREFERENCES_KEY = '@AgendaFamiliar:preferences';

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  preferences: defaultPreferences,

  setUser: (user: User | null) => {
    set({ user });
  },

  setPreferences: async (preferences: Partial<Preferences>) => {
    const newPreferences = { ...get().preferences, ...preferences };
    set({ preferences: newPreferences });

    // Persist to AsyncStorage
    try {
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPreferences));
      console.log('[UserStore] Preferences saved:', newPreferences);
    } catch (error) {
      console.error('[UserStore] Error saving preferences:', error);
    }
  },

  loadPreferences: async () => {
    try {
      const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        const preferences = JSON.parse(stored);
        set({ preferences });
        console.log('[UserStore] Preferences loaded:', preferences);
      }
    } catch (error) {
      console.error('[UserStore] Error loading preferences:', error);
    }
  },

  logout: () => {
    set({ user: null, preferences: defaultPreferences });
  },
}));
