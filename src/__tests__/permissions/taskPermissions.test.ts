/**
 * Testes para Task Permissions
 * 
 * Testa lógica de privacidade e controle de acesso (RBAC)
 */
import type { Task, User } from '@types';
import {
    canUserDeleteTask,
    canUserEditTask,
    canUserViewTask,
    convertTaskToPrivate,
    convertTaskToPublic,
    filterVisibleTasks,
} from '@utils/taskPermissions';

// Mock users
const adminUser: User = {
    uid: 'admin-123',
    email: 'admin@test.com',
    displayName: 'Admin User',
    role: 'admin',
    familyId: 'family-1',
};

const dependentUser: User = {
    uid: 'dependent-456',
    email: 'dependent@test.com',
    displayName: 'Dependent User',
    role: 'dependent',
    familyId: 'family-1',
};

const otherFamilyUser: User = {
    uid: 'other-789',
    email: 'other@test.com',
    displayName: 'Other User',
    role: 'admin',
    familyId: 'family-2',
};

// Mock tasks
const publicTask: Task = {
    id: 'task-1',
    title: 'Public Task',
    description: 'A public task',
    dueDate: '2024-12-25',
    category: 'work',
    recurrence: 'none',
    completed: false,
    familyId: 'family-1',
    createdBy: 'admin-123',
    isPrivate: false,
    subtasks: [],
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-20T10:00:00Z',
};

const privateTaskByAdmin: Task = {
    ...publicTask,
    id: 'task-2',
    title: 'Private Task by Admin',
    isPrivate: true,
    createdBy: 'admin-123',
};

const privateTaskByDependent: Task = {
    ...publicTask,
    id: 'task-3',
    title: 'Private Task by Dependent',
    isPrivate: true,
    createdBy: 'dependent-456',
};

describe('Task Permissions', () => {
    describe('canUserViewTask', () => {
        it('should allow creator to view their private task', () => {
            expect(canUserViewTask(privateTaskByAdmin, adminUser)).toBe(true);
        });

        it('should NOT allow other users to view private task', () => {
            expect(canUserViewTask(privateTaskByAdmin, dependentUser)).toBe(false);
        });

        it('should allow family members to view public task', () => {
            expect(canUserViewTask(publicTask, adminUser)).toBe(true);
            expect(canUserViewTask(publicTask, dependentUser)).toBe(true);
        });

        it('should NOT allow users from other families to view task', () => {
            expect(canUserViewTask(publicTask, otherFamilyUser)).toBe(false);
        });

        it('should return false for null user', () => {
            expect(canUserViewTask(publicTask, null)).toBe(false);
        });
    });

    describe('canUserEditTask', () => {
        it('should allow user to edit their own task', () => {
            expect(canUserEditTask(privateTaskByAdmin, adminUser)).toBe(true);
            expect(canUserEditTask(privateTaskByDependent, dependentUser)).toBe(true);
        });

        it('should allow admin to edit public tasks in their family', () => {
            expect(canUserEditTask(publicTask, adminUser)).toBe(true);
        });

        it('should NOT allow admin to edit private tasks from others', () => {
            expect(canUserEditTask(privateTaskByDependent, adminUser)).toBe(false);
        });

        it('should NOT allow dependent to edit tasks from others', () => {
            expect(canUserEditTask(publicTask, dependentUser)).toBe(false);
        });

        it('should return false for null user', () => {
            expect(canUserEditTask(publicTask, null)).toBe(false);
        });
    });

    describe('canUserDeleteTask', () => {
        it('should allow user to delete their own task', () => {
            expect(canUserDeleteTask(privateTaskByAdmin, adminUser)).toBe(true);
        });

        it('should allow admin to delete public tasks in their family', () => {
            expect(canUserDeleteTask(publicTask, adminUser)).toBe(true);
        });

        it('should NOT allow admin to delete private tasks from others', () => {
            expect(canUserDeleteTask(privateTaskByDependent, adminUser)).toBe(false);
        });

        it('should NOT allow dependent to delete tasks from others', () => {
            expect(canUserDeleteTask(publicTask, dependentUser)).toBe(false);
        });
    });

    describe('filterVisibleTasks', () => {
        const allTasks = [publicTask, privateTaskByAdmin, privateTaskByDependent];

        it('should show all public + own private tasks for admin', () => {
            const visible = filterVisibleTasks(allTasks, adminUser);
            expect(visible).toHaveLength(2);
            expect(visible.map(t => t.id)).toContain('task-1'); // public
            expect(visible.map(t => t.id)).toContain('task-2'); // admin's private
        });

        it('should show all public + own private tasks for dependent', () => {
            const visible = filterVisibleTasks(allTasks, dependentUser);
            expect(visible).toHaveLength(2);
            expect(visible.map(t => t.id)).toContain('task-1'); // public
            expect(visible.map(t => t.id)).toContain('task-3'); // dependent's private
        });

        it('should return empty array for null user', () => {
            expect(filterVisibleTasks(allTasks, null)).toHaveLength(0);
        });

        it('should return empty array for user from different family', () => {
            expect(filterVisibleTasks(allTasks, otherFamilyUser)).toHaveLength(0);
        });
    });

    describe('convertTaskToPrivate', () => {
        it('should transfer ownership when converting to private', () => {
            const result = convertTaskToPrivate({ title: 'Test' }, 'new-owner-id');
            expect(result.isPrivate).toBe(true);
            expect(result.createdBy).toBe('new-owner-id');
        });
    });

    describe('convertTaskToPublic', () => {
        it('should mark as public without changing owner', () => {
            const result = convertTaskToPublic({ title: 'Test', createdBy: 'original-owner' });
            expect(result.isPrivate).toBe(false);
            expect(result.createdBy).toBe('original-owner');
        });
    });
});
