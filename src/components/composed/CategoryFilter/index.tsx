/**
 * CategoryFilter Component
 * 
 * Componente composto que exibe filtros de categoria
 * Usa o componente base FilterButton
 * 
 * @example
 * ```tsx
 * <CategoryFilter
 *   categories={categories}
 *   selectedCategoryId={selectedId}
 *   onSelectCategory={handleSelect}
 *   taskCounts={counts}
 * />
 * ```
 */

import React from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterButton } from '@src/components/base';
import { styles } from './CategoryFilter.styles';
import type { CategoryFilterProps } from './CategoryFilter.types';

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategoryId,
    onSelectCategory,
    taskCounts = {},
    showAllButton = true,
}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Botão "Todas" */}
                {showAllButton && (
                    <FilterButton
                        label="Todas"
                        active={selectedCategoryId === null}
                        count={Object.values(taskCounts).reduce((sum, count) => sum + count, 0)}
                        onPress={() => onSelectCategory(null)}
                        icon={<Ionicons name="apps-outline" size={16} />}
                    />
                )}

                {/* Botões de Categoria */}
                {categories.map((category) => (
                    <FilterButton
                        key={category.id}
                        label={category.label}
                        active={selectedCategoryId === category.id}
                        count={taskCounts[category.id] || 0}
                        onPress={() => onSelectCategory(category.id)}
                        icon={
                            category.icon ? (
                                <Ionicons name={category.icon as any} size={16} />
                            ) : undefined
                        }
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default CategoryFilter;
