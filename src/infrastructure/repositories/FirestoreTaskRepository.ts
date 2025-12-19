import firebase, { firestore, auth } from '@src/firebase/config/firebase.config';
import type { Task } from '@types';
import type { ITaskRepository } from '@domain/repositories/ITaskRepository';

const TASKS_COLLECTION = 'tasks';

/**
 * Firestore implementation of ITaskRepository
 * Concrete implementation that can be swapped for testing or different data sources
 */
export class FirestoreTaskRepository implements ITaskRepository {
  async create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    if (!task.familyId) {
      throw new Error('Tarefa deve pertencer a uma família');
    }

    const now = new Date().toISOString();
    const taskData = {
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate,
      dueTime: task.dueTime || null,
      category: task.category,
      completed: task.completed,
      recurrence: task.recurrence || 'none',
      subtasks: task.subtasks || [],
      userId: user.uid,
      familyId: task.familyId,
      createdBy: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await firestore.collection(TASKS_COLLECTION).add(taskData);

    return {
      ...task,
      id: docRef.id,
      createdAt: now,
      updatedAt: now,
    };
  }

  async update(id: string, updates: Partial<Task>): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    const cleanUpdates: any = { ...updates };
    Object.keys(cleanUpdates).forEach(
      key => cleanUpdates[key] === undefined && delete cleanUpdates[key]
    );

    cleanUpdates.updatedAt = firebase.firestore.FieldValue.serverTimestamp();

    await firestore
      .collection(TASKS_COLLECTION)
      .doc(id)
      .update(cleanUpdates);
  }

  async delete(id: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    // Soft delete
    await firestore.collection(TASKS_COLLECTION).doc(id).update({
      deletedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  async getById(id: string): Promise<Task | null> {
    const doc = await firestore.collection(TASKS_COLLECTION).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      updatedAt: data?.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
    } as Task;
  }

  subscribe(familyId: string, callback: (tasks: Task[]) => void): () => void {
    if (!familyId) {
      callback([]);
      return () => { };
    }

    return firestore
      .collection(TASKS_COLLECTION)
      .where('familyId', '==', familyId)
      .onSnapshot(
        (snapshot: any) => {
          const tasks = snapshot.docs.map((doc: any) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
              updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
            };
          }) as Task[];
          callback(tasks);
        },
        (error: any) => {
          console.error('Error subscribing to tasks:', error);
        }
      );
  }

  async getOldCompletedTasks(familyId: string, beforeDate: string): Promise<Task[]> {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    const beforeTimestamp = new Date(beforeDate);

    // Simplified query to avoid composite index requirement
    // We'll filter by date in code instead
    const snapshot = await firestore
      .collection(TASKS_COLLECTION)
      .where('familyId', '==', familyId)
      .where('completed', '==', true)
      .get();

    // Filter by date in code
    return snapshot.docs
      .map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
        };
      })
      .filter((task: Task) => {
        if (!task.updatedAt) return false;
        const updatedDate = new Date(task.updatedAt);
        return updatedDate < beforeTimestamp;
      }) as Task[];
  }
}

// Export singleton instance
export const firestoreTaskRepository = new FirestoreTaskRepository();
