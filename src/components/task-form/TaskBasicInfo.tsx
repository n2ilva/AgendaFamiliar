import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@hooks/useThemeColors';
import { spacing, fontSize } from '@styles/spacing';

interface TaskBasicInfoProps {
  title: string;
  description: string;
  onTitleChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
}

/**
 * Component for basic task information (title and description)
 * Follows Single Responsibility Principle
 */
export const TaskBasicInfo: React.FC<TaskBasicInfoProps> = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}) => {
  const colors = useThemeColors();

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: colors.text }]}>Título *</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        value={title}
        onChangeText={onTitleChange}
        placeholder="Digite o título da tarefa"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={[styles.label, { color: colors.text }]}>Descrição</Text>
      <TextInput
        style={[
          styles.input,
          styles.textArea,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        value={description}
        onChangeText={onDescriptionChange}
        placeholder="Digite a descrição (opcional)"
        placeholderTextColor={colors.textSecondary}
        multiline
        numberOfLines={4}
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: fontSize.base,
    marginBottom: spacing.md,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
