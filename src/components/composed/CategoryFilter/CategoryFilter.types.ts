/**
 * CategoryFilter Types
 */

import type { Category } from '@types';

export interface CategoryFilterProps {
    /**
     * Lista de categorias disponíveis
     */
    categories: Category[];

    /**
     * ID da categoria selecionada (null = todas)
     */
    selectedCategoryId: string | null;

    /**
     * Callback quando uma categoria é selecionada
     */
    onSelectCategory: (categoryId: string | null) => void;

    /**
     * Contador de tarefas por categoria
     */
    taskCounts?: Record<string, number>;

    /**
     * Se true, mostra o botão "Todas"
     */
    showAllButton?: boolean;
}
