import type { Task } from '@types';

/**
 * Repository interface for Task data access
 * Follows Dependency Inversion Principle - depend on abstraction, not concrete implementation
 */
export interface ITaskRepository {
  /**
   * Creates a new task
   * @param task - Task data without id, createdAt, updatedAt
   * @returns Created task with id and timestamps
   */
  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;

  /**
   * Updates an existing task
   * @param id - Task ID
   * @param updates - Partial task data to update
   */
  update(id: string, updates: Partial<Task>): Promise<void>;

  /**
   * Soft deletes a task (sets deletedAt timestamp)
   * @param id - Task ID
   */
  delete(id: string): Promise<void>;

  /**
   * Gets a single task by ID
   * @param id - Task ID
   * @returns Task or null if not found
   */
  getById(id: string): Promise<Task | null>;

  /**
   * Subscribes to real-time task updates for a family
   * @param familyId - Family ID
   * @param callback - Callback function called when tasks change
   * @returns Unsubscribe function
   */
  subscribe(familyId: string, callback: (tasks: Task[]) => void): () => void;

  /**
   * Gets old completed tasks for cleanup
   * @param familyId - Family ID
   * @param beforeDate - ISO date string - tasks completed before this date
   * @returns Array of old completed tasks
   */
  getOldCompletedTasks(familyId: string, beforeDate: string): Promise<Task[]>;
}
