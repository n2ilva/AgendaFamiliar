import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import { Colors } from '@styles/colors';
import { spacing, fontSize } from '@styles/spacing';

interface PickerOption {
  label: string;
  value: string;
}

interface PickerModalProps {
  visible: boolean;
  title: string;
  options: PickerOption[];
  onSelect: (value: string) => void;
  onClose: () => void;
  onCreate?: () => void;
}

export default function PickerModal({
  visible,
  title,
  options,
  onSelect,
  onClose,
  onCreate,
}: PickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              onCreate ? (
                <TouchableOpacity
                  style={[styles.option, styles.createOption]}
                  onPress={() => {
                    onClose();
                    onCreate();
                  }}
                >
                  <Text style={styles.createOptionText}>+ Criar nova...</Text>
                </TouchableOpacity>
              ) : null
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: Colors.light.text,
  },
  closeButton: {
    fontSize: fontSize.xl,
    color: Colors.light.textSecondary,
  },
  option: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  optionText: {
    fontSize: fontSize.base,
    color: Colors.light.text,
  },
  createOption: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    borderBottomWidth: 0,
    marginTop: spacing.sm,
  },
  createOptionText: {
    fontSize: fontSize.base,
    color: Colors.primary,
    fontWeight: '600',
  },
});


