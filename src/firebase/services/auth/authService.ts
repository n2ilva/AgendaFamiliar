import { auth } from '../../config/firebase.config';
import firebase from 'firebase/compat/app';
import { useUserStore } from '@store/userStore';
import { userService } from '../database/userService';
import type { User } from '@types';

/**
 * Serviço de Autenticação
 * 
 * Responsável por todas as operações de autenticação do Firebase
 * Segue o Single Responsibility Principle (SRP)
 */
export const authService = {
    /**
     * Registra um novo usuário
     */
    async register(
        email: string,
        password: string,
        displayName: string
    ): Promise<User> {
        console.log('[AuthService] Attempting registration for:', email);
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(
                email,
                password
            );
            const firebaseUser = userCredential.user;

            if (displayName && firebaseUser) {
                await firebaseUser.updateProfile({ displayName });
            }

            console.log('[AuthService] Registration successful for:', email);

            const user: User = {
                uid: firebaseUser?.uid || '',
                email: firebaseUser?.email || '',
                displayName: displayName || firebaseUser?.displayName || undefined,
                photoURL: firebaseUser?.photoURL || undefined,
            };

            // Create profile in Firestore
            await userService.createUserProfile(user);

            useUserStore.getState().setUser(user);
            return user;
        } catch (error: any) {
            console.error('[AuthService] Registration error for:', email);
            console.error('[AuthService] Error code:', error.code);
            console.error('[AuthService] Error message:', error.message);
            console.error('[AuthService] Full error:', error);
            throw error;
        }
    },

    /**
     * Faz login de um usuário existente
     */
    async login(email: string, password: string): Promise<User> {
        console.log('[AuthService] Attempting login for:', email);
        try {
            const userCredential = await auth.signInWithEmailAndPassword(
                email,
                password
            );
            const firebaseUser = userCredential.user;
            if (!firebaseUser) throw new Error('Falha no login');

            console.log('[AuthService] Login successful for:', email);

            let user: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || undefined,
                photoURL: firebaseUser.photoURL || undefined,
            };

            // Fetch extended profile
            const profile = await userService.getUserProfile(firebaseUser.uid);
            if (profile) {
                user = { ...user, ...profile };
            } else {
                // If no profile exists (legacy user?), create one
                await userService.createUserProfile(user);
            }

            useUserStore.getState().setUser(user);
            return user;
        } catch (error: any) {
            console.error('[AuthService] Login error for:', email);
            console.error('[AuthService] Error code:', error.code);
            console.error('[AuthService] Error message:', error.message);
            console.error('[AuthService] Full error:', error);
            throw error;
        }
    },

    /**
     * Faz logout do usuário atual
     */
    async logout(): Promise<void> {
        await auth.signOut();
        useUserStore.getState().logout();
    },

    /**
     * Obtém o usuário atual (síncrono)
     */
    getCurrentUser(): User | null {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return null;

        return {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
        };
    },

    /**
     * Recarrega o perfil completo do usuário
     */
    async reloadUserProfile(): Promise<User | null> {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return null;

        const profile = await userService.getUserProfile(firebaseUser.uid);
        if (profile) {
            useUserStore.getState().setUser(profile);
            return profile;
        }
        return null;
    },

    /**
     * Obtém dados completos do usuário
     */
    async getUserData(firebaseUser: firebase.User): Promise<User> {
        let user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
        };

        const profile = await userService.getUserProfile(firebaseUser.uid);
        if (profile) {
            user = { ...user, ...profile };
        }
        return user;
    },
};

export default authService;
