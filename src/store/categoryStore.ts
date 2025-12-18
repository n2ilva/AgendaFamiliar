import { create } from 'zustand';
import { DEFAULT_CATEGORIES } from '@utils/taskUtils';
import { categoryService } from '@src/firebase';
import type { Category } from '@types';

interface CategoryStore {
    categories: Category[];
    customCategories: Category[];
    familyId: string | null;
    unsubscribe: (() => void) | null;

    initialize: (familyId: string) => void;
    cleanup: () => void;
    addCategory: (name: string, icon: string, color: string, familyId: string) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    getCategoryById: (id: string) => Category | undefined;
    getAllCategories: () => Category[];
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
    categories: DEFAULT_CATEGORIES,
    customCategories: [],
    familyId: null,
    unsubscribe: null,

    initialize: (familyId: string) => {
        const state = get();

        // Cleanup previous subscription
        if (state.unsubscribe) {
            state.unsubscribe();
        }

        // Subscribe to family categories
        const unsubscribe = categoryService.subscribeToCategories(familyId, (customCategories) => {
            set({
                customCategories,
                categories: [...DEFAULT_CATEGORIES, ...customCategories],
            });
        });

        set({ familyId, unsubscribe });
    },

    cleanup: () => {
        const state = get();
        if (state.unsubscribe) {
            state.unsubscribe();
        }
        set({
            unsubscribe: null,
            familyId: null,
            customCategories: [],
            categories: DEFAULT_CATEGORIES,
        });
    },

    addCategory: async (name: string, icon: string, color: string, familyId: string) => {
        try {
            await categoryService.createCategory({
                label: name,
                icon,
                color,
                familyId,
                isDefault: false,
            });
            // Real-time listener will update the store automatically
        } catch (error) {
            console.error('Error adding category:', error);
            throw error;
        }
    },

    deleteCategory: async (id: string) => {
        try {
            await categoryService.deleteCategory(id);
            // Real-time listener will update the store automatically
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    },

    getCategoryById: (id: string) => {
        return get().categories.find((c) => c.id === id);
    },

    getAllCategories: () => {
        return get().categories;
    },
}));
