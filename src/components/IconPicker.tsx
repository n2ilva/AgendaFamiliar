import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@hooks/useThemeColors';
import { spacing } from '@styles/spacing';

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
}

// Popular category icons
const CATEGORY_ICONS = [
  'home-outline',
  'briefcase-outline',
  'fitness-outline',
  'cart-outline',
  'restaurant-outline',
  'car-outline',
  'airplane-outline',
  'book-outline',
  'school-outline',
  'medical-outline',
  'heart-outline',
  'people-outline',
  'gift-outline',
  'paw-outline',
  'game-controller-outline',
  'musical-notes-outline',
  'camera-outline',
  'brush-outline',
  'hammer-outline',
  'leaf-outline',
  'water-outline',
  'sunny-outline',
  'moon-outline',
  'star-outline',
  'trophy-outline',
  'rocket-outline',
  'bulb-outline',
  'flash-outline',
  'shield-outline',
  'flag-outline',
];

/**
 * Horizontal scrollable icon picker
 * Displays popular category icons for selection
 */
export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onSelectIcon,
}) => {
  const colors = useThemeColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {CATEGORY_ICONS.map((icon) => {
        const isSelected = icon === selectedIcon;
        return (
          <TouchableOpacity
            key={icon}
            style={[
              styles.iconButton,
              {
                backgroundColor: isSelected ? colors.primary : colors.surface,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onSelectIcon(icon)}
          >
            <Ionicons
              name={icon as any}
              size={28}
              color={isSelected ? '#fff' : colors.text}
            />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 80,
  },
  scrollContent: {
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
