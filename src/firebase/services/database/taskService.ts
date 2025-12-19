import type { Task } from '@types';
import type { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { firestoreTaskRepository } from '@infrastructure/repositories/FirestoreTaskRepository';

/**
 * Serviço de Tarefas
 * 
 * Facade sobre o repositório de tarefas
 * Usa Dependency Injection para melhor testabilidade
 * Segue o Single Responsibility Principle (SRP)
 */
class TaskService {
    constructor(private repository: ITaskRepository) { }

    /**
     * Cria uma nova tarefa
     */
    async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
        return this.repository.create(task);
    }

    /**
     * Atualiza uma tarefa existente
     */
    async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
        return this.repository.update(taskId, updates);
    }

    /**
     * Deleta uma tarefa
     */
    async deleteTask(taskId: string): Promise<void> {
        return this.repository.delete(taskId);
    }

    /**
     * Obtém uma tarefa por ID
     */
    async getTaskById(taskId: string): Promise<Task | null> {
        return this.repository.getById(taskId);
    }

    /**
     * Inscreve-se para receber atualizações de tarefas em tempo real
     */
    subscribeToTasks(familyId: string, onUpdate: (tasks: Task[]) => void): () => void {
        return this.repository.subscribe(familyId, onUpdate);
    }

    /**
     * Obtém tarefas concluídas antigas (para limpeza automática)
     */
    async getOldCompletedTasks(familyId: string, beforeDate: string): Promise<Task[]> {
        return this.repository.getOldCompletedTasks(familyId, beforeDate);
    }
}

// Export singleton with Firestore repository
export const taskService = new TaskService(firestoreTaskRepository);

export default taskService;
