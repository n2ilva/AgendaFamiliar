/**
 * TaskCard Types
 * 
 * Tipos para o componente TaskCard
 */

import type { Task } from '@types';

export interface TaskCardProps {
    /**
     * Dados da tarefa
     */
    task: Task;

    /**
     * Callback quando a tarefa é pressionada
     */
    onPress?: (task: Task) => void;

    /**
     * Callback quando o checkbox é pressionado
     */
    onToggle?: (taskId: string) => void;

    /**
     * Callback quando o botão de pular é pressionado (tarefas recorrentes)
     */
    onSkip?: (taskId: string) => void;

    /**
     * Se true, mostra informações adicionais
     */
    detailed?: boolean;

    /**
     * Se true, desabilita interações
     */
    disabled?: boolean;
}
