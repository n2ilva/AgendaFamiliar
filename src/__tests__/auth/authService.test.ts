/**
 * Testes para Auth Service
 * 
 * Testa login, logout e autenticação
 */
import { authService } from '@src/firebase/services/auth/authService';
import { useUserStore } from '@store/userStore';

// Mock Firebase Auth
jest.mock('@src/firebase/config/firebase.config', () => ({
    auth: {
        signInWithEmailAndPassword: jest.fn(),
        createUserWithEmailAndPassword: jest.fn(),
        signOut: jest.fn(),
        currentUser: null,
    },
}));

// Mock User Service
jest.mock('@src/firebase/services/database/userService', () => ({
    userService: {
        getUserProfile: jest.fn(),
        createUserProfile: jest.fn(),
    },
}));

// Import mocks
import { auth } from '@src/firebase/config/firebase.config';
import { userService } from '@src/firebase/services/database/userService';

const mockAuth = auth as jest.Mocked<typeof auth>;
const mockUserService = userService as jest.Mocked<typeof userService>;

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset user store
        useUserStore.setState({ user: null });
    });

    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
            const mockFirebaseUser = {
                uid: 'user-123',
                email: 'test@test.com',
                displayName: 'Test User',
                photoURL: null,
            };

            const mockProfile = {
                uid: 'user-123',
                email: 'test@test.com',
                displayName: 'Test User',
                familyId: 'family-1',
                role: 'admin' as const,
            };

            (mockAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
                user: mockFirebaseUser,
            });
            (mockUserService.getUserProfile as jest.Mock).mockResolvedValue(mockProfile);

            const result = await authService.login('test@test.com', 'password123');

            expect(result.uid).toBe('user-123');
            expect(result.email).toBe('test@test.com');
            expect(mockAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
                'test@test.com',
                'password123'
            );
        });

        it('should throw error with invalid credentials', async () => {
            const authError = {
                code: 'auth/wrong-password',
                message: 'Wrong password',
            };

            (mockAuth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue(authError);

            await expect(
                authService.login('test@test.com', 'wrongpassword')
            ).rejects.toEqual(authError);
        });

        it('should throw error when user not found', async () => {
            const authError = {
                code: 'auth/user-not-found',
                message: 'User not found',
            };

            (mockAuth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue(authError);

            await expect(
                authService.login('nonexistent@test.com', 'password')
            ).rejects.toEqual(authError);
        });
    });

    describe('logout', () => {
        it('should logout successfully', async () => {
            // Set initial user
            useUserStore.setState({
                user: { uid: 'user-123', email: 'test@test.com' },
            });

            (mockAuth.signOut as jest.Mock).mockResolvedValue(undefined);

            await authService.logout();

            expect(mockAuth.signOut).toHaveBeenCalled();
            expect(useUserStore.getState().user).toBeNull();
        });
    });

    describe('getCurrentUser', () => {
        it('should return null when no user is logged in', () => {
            (mockAuth as any).currentUser = null;

            const result = authService.getCurrentUser();

            expect(result).toBeNull();
        });

        it('should return user data when logged in', () => {
            (mockAuth as any).currentUser = {
                uid: 'user-123',
                email: 'test@test.com',
                displayName: 'Test User',
                photoURL: 'https://photo.url',
            };

            const result = authService.getCurrentUser();

            expect(result).toEqual({
                uid: 'user-123',
                email: 'test@test.com',
                displayName: 'Test User',
                photoURL: 'https://photo.url',
            });
        });
    });
});
