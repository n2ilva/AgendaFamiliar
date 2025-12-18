import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useThemeColors } from '@hooks/useThemeColors';
import { spacing } from '@styles/spacing';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

// Vibrant color palette for categories
const COLOR_PALETTE = [
  // Reds & Pinks
  '#FF6B6B', '#EE5A6F', '#E63946', '#D62828', '#FF4D6D', '#FF006E',
  // Oranges
  '#FF9F1C', '#FFBA08', '#FF8500', '#F77F00', '#FB8500', '#FFA500',
  // Yellows
  '#FFD60A', '#FFEA00', '#FFC300', '#FFD500', '#FFDD00', '#FFEB3B',
  // Greens
  '#06FFA5', '#00F5D4', '#06D6A0', '#2EC4B6', '#4CAF50', '#8BC34A',
  // Blues
  '#4CC9F0', '#4361EE', '#3A86FF', '#2196F3', '#03A9F4', '#00BCD4',
  // Purples
  '#7209B7', '#9D4EDD', '#B5179E', '#9C27B0', '#AB47BC', '#BA68C8',
  // Browns & Neutrals
  '#8D5524', '#A0522D', '#795548', '#6D4C41', '#5D4037', '#4E342E',
  // Grays
  '#6C757D', '#495057', '#343A40', '#78909C', '#607D8B', '#546E7A',
];

/**
 * Color palette picker
 * Grid layout with vibrant colors for category customization
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onSelectColor,
}) => {
  const colors = useThemeColors();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.grid}>
        {COLOR_PALETTE.map((color) => {
          const isSelected = color === selectedColor;
          return (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                {
                  backgroundColor: color,
                  borderColor: isSelected ? colors.text : 'transparent',
                  borderWidth: isSelected ? 3 : 0,
                },
              ]}
              onPress={() => onSelectColor(color)}
            >
              {isSelected && (
                <View style={styles.checkmark}>
                  <View style={[styles.checkmarkInner, { backgroundColor: colors.background }]} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 200,
  },
  scrollContent: {
    paddingBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
