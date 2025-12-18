import { firestore } from '../../config/firebase.config';
import type { User } from '@types';

const USERS_COLLECTION = 'users';

/**
 * Serviço de Usuários
 * 
 * Responsável por operações CRUD de perfis de usuários no Firestore
 * Segue o Single Responsibility Principle (SRP)
 */
export const userService = {
    /**
     * Obtém o perfil de um usuário
     */
    async getUserProfile(uid: string): Promise<User | null> {
        try {
            const doc = await firestore.collection(USERS_COLLECTION).doc(uid).get();
            if (doc.exists) {
                return doc.data() as User;
            }
            return null;
        } catch (error) {
            console.error('[UserService] Error fetching user profile:', error);
            return null;
        }
    },

    /**
     * Cria um novo perfil de usuário
     */
    async createUserProfile(user: User): Promise<void> {
        try {
            // Sanitize user object to remove undefined values (Firestore doesn't like them)
            const safeUser = JSON.parse(JSON.stringify(user));
            await firestore.collection(USERS_COLLECTION).doc(user.uid).set(safeUser, { merge: true });
        } catch (error) {
            console.error('[UserService] Error creating user profile:', error);
            throw error;
        }
    },

    /**
     * Atualiza o perfil de um usuário
     */
    async updateUserProfile(uid: string, updates: Partial<User>): Promise<void> {
        try {
            await firestore.collection(USERS_COLLECTION).doc(uid).update(updates);
        } catch (error) {
            console.error('[UserService] Error updating profile:', error);
            throw error;
        }
    },
};

export default userService;
