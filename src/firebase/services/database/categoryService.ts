import firebase from 'firebase/compat/app';
import { firestore, auth } from '../../config/firebase.config';
import type { Category } from '@types';

const CATEGORIES_COLLECTION = 'categories';

/**
 * Serviço de Categorias
 * 
 * Responsável por operações CRUD de categorias no Firestore
 * Segue o Single Responsibility Principle (SRP)
 */
export const categoryService = {
    /**
     * Cria uma nova categoria
     */
    async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
        const user = auth.currentUser;
        if (!user) throw new Error('Usuário não autenticado');

        if (!category.familyId) {
            throw new Error('Categoria deve pertencer a uma família');
        }

        const categoryData = {
            label: category.label,
            icon: category.icon,
            color: category.color,
            familyId: category.familyId,
            isDefault: false,
            createdBy: user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await firestore.collection(CATEGORIES_COLLECTION).add(categoryData);

        return {
            id: docRef.id,
            ...category,
        };
    },

    /**
     * Deleta uma categoria
     */
    async deleteCategory(categoryId: string): Promise<void> {
        const user = auth.currentUser;
        if (!user) throw new Error('Usuário não autenticado');

        await firestore.collection(CATEGORIES_COLLECTION).doc(categoryId).delete();
    },

    /**
     * Inscreve-se para receber atualizações de categorias em tempo real
     */
    subscribeToCategories(familyId: string, onUpdate: (categories: Category[]) => void): () => void {
        if (!familyId) {
            onUpdate([]);
            return () => { };
        }

        return firestore
            .collection(CATEGORIES_COLLECTION)
            .where('familyId', '==', familyId)
            .onSnapshot(
                (snapshot: any) => {
                    const categories = snapshot.docs.map((doc: any) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as Category[];
                    onUpdate(categories);
                },
                (error: any) => {
                    console.error('[CategoryService] Error subscribing to categories:', error);
                }
            );
    },
};

export default categoryService;
