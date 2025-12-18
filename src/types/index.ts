export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  category: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime?: string;
  category: string;
  completed: boolean;
  recurrence: RecurrenceType;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: any; // Timestamp or null
  notificationIds?: string[];
  familyId?: string;
  createdBy?: string;
}

export interface Category {
  id: string;
  label: string;
  color: string;
  icon: string;
  familyId?: string;
  isDefault?: boolean;
  createdBy?: string;
}

export type UserRole = 'admin' | 'parent' | 'dependent';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  familyId?: string;
  role?: UserRole;
}

export interface Family {
  id: string;
  name: string;
  code: string;
  createdBy: string;
  createdAt: string;
}

export interface ApprovalRequest {
  id: string;
  familyId: string;
  taskId: string;
  requestedBy: string;
  userName: string;
  action: 'update' | 'delete' | 'complete';
  data: Partial<Task>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Preferences {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en';
  notifications: boolean;
}
