import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@hooks/useThemeColors';
import { spacing, fontSize } from '@styles/spacing';
import { getCategoryLabel, getCategoryColor, CATEGORY_OPTIONS } from '@utils/taskUtils';
import type { Subtask } from '@types';
import PickerModal from '@components/PickerModal';

interface TaskSubtasksProps {
  subtasks: Subtask[];
  onAdd: (title: string, category: string) => void;
  onRemove: (id: string) => void;
}

/**
 * Component for managing task subtasks
 * Handles adding, removing, and displaying subtasks
 */
export const TaskSubtasks: React.FC<TaskSubtasksProps> = ({
  subtasks,
  onAdd,
  onRemove,
}) => {
  const colors = useThemeColors();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskCategory, setNewSubtaskCategory] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleAdd = () => {
    if (!newSubtaskTitle.trim()) {
      Alert.alert('Erro', 'Digite um título para a subtarefa');
      return;
    }

    onAdd(newSubtaskTitle, newSubtaskCategory);
    setNewSubtaskTitle('');
    setNewSubtaskCategory('');
  };

  const renderSubtask = ({ item }: { item: Subtask }) => (
    <View style={[styles.subtaskItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.subtaskInfo}>
        <Text style={[styles.subtaskTitle, { color: colors.text }]}>{item.title}</Text>
        {item.category && (
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(item.category) + '20' },
            ]}
          >
            <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
              {getCategoryLabel(item.category)}
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeButton}>
        <Ionicons name="trash-outline" size={20} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: colors.text }]}>Subtarefas</Text>

      <View style={styles.addSubtaskContainer}>
        <TextInput
          style={[
            styles.input,
            styles.subtaskInput,
            { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border },
          ]}
          value={newSubtaskTitle}
          onChangeText={setNewSubtaskTitle}
          placeholder="Nova subtarefa"
          placeholderTextColor={colors.textSecondary}
        />

        <TouchableOpacity
          style={[styles.categoryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => setShowCategoryPicker(true)}
        >
          <Text style={[styles.categoryButtonText, { color: newSubtaskCategory ? colors.text : colors.textSecondary }]}>
            {newSubtaskCategory ? getCategoryLabel(newSubtaskCategory) : 'Categoria'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAdd}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {subtasks.length > 0 && (
        <FlatList
          data={subtasks}
          renderItem={renderSubtask}
          keyExtractor={(item) => item.id}
          style={styles.subtasksList}
          scrollEnabled={false}
        />
      )}

      <PickerModal
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        title="Selecionar Categoria"
        options={CATEGORY_OPTIONS}
        onSelect={(value: string) => {
          setNewSubtaskCategory(value);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  addSubtaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: fontSize.base,
  },
  subtaskInput: {
    flex: 1,
    marginRight: spacing.sm,
  },
  categoryButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    marginRight: spacing.sm,
  },
  categoryButtonText: {
    fontSize: fontSize.sm,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtasksList: {
    maxHeight: 300,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  subtaskInfo: {
    flex: 1,
  },
  subtaskTitle: {
    fontSize: fontSize.base,
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  removeButton: {
    padding: spacing.sm,
  },
});
