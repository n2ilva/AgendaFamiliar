import { create } from 'zustand';
import type { User, Preferences } from '@types';

interface UserStore {
  user: User | null;
  preferences: Preferences;
  setUser: (user: User | null) => void;
  setPreferences: (preferences: Partial<Preferences>) => void;
  logout: () => void;
}

const defaultPreferences: Preferences = {
  theme: 'light',
  language: 'pt-BR',
  notifications: true,
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  preferences: defaultPreferences,

  setUser: (user: User | null) => {
    set({ user });
  },

  setPreferences: (preferences: Partial<Preferences>) => {
    set((state) => ({
      preferences: { ...state.preferences, ...preferences },
    }));
  },

  logout: () => {
    set({ user: null, preferences: defaultPreferences });
  },
}));
