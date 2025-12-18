import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@hooks/useThemeColors';
import { spacing, fontSize } from '@styles/spacing';
import { IconPicker } from './IconPicker';
import { ColorPicker } from './ColorPicker';

interface CreateCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, icon: string, color: string) => void;
}

/**
 * Modal for creating custom categories
 * Allows selection of name, icon, and color
 */
export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const colors = useThemeColors();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('home-outline');
  const [selectedColor, setSelectedColor] = useState('#4CC9F0');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Digite um nome para a categoria');
      return;
    }

    onSave(name.trim(), selectedIcon, selectedColor);
    
    // Reset form
    setName('');
    setSelectedIcon('home-outline');
    setSelectedColor('#4CC9F0');
  };

  const handleClose = () => {
    setName('');
    setSelectedIcon('home-outline');
    setSelectedColor('#4CC9F0');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Nova Categoria
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Preview */}
          <View style={[styles.preview, { backgroundColor: colors.surface }]}>
            <View
              style={[
                styles.previewIcon,
                { backgroundColor: selectedColor },
              ]}
            >
              <Ionicons name={selectedIcon as any} size={32} color="#fff" />
            </View>
            <Text style={[styles.previewText, { color: colors.text }]}>
              {name || 'Nome da categoria'}
            </Text>
          </View>

          {/* Name Input */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Nome</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Trabalho, Estudos..."
              placeholderTextColor={colors.textSecondary}
              maxLength={20}
            />
          </View>

          {/* Icon Picker */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Ícone</Text>
            <IconPicker
              selectedIcon={selectedIcon}
              onSelectIcon={setSelectedIcon}
            />
          </View>

          {/* Color Picker */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Cor</Text>
            <ColorPicker
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
              onPress={handleClose}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  previewIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  previewText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    flex: 1,
  },
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
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    // backgroundColor set dynamically
  },
  buttonText: {
    fontSize: fontSize.base,
    fontWeight: '600',
  },
});
