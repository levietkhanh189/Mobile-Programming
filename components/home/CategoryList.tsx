import React, { memo, useCallback } from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

interface CategoryListProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryList = memo(function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  const handlePress = useCallback(
    (cat: string) => onSelectCategory(cat),
    [onSelectCategory]
  );

  const renderChip = (label: string) => {
    const selected = selectedCategory === label;
    return (
      <TouchableOpacity
        key={label}
        onPress={() => handlePress(label)}
        style={[styles.chip, selected && styles.chipSelected]}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={`Category: ${label}`}
      >
        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop by Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderChip('All')}
        {categories.map(renderChip)}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text,
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.screenPadding,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  chipSelected: {
    backgroundColor: COLORS.headerBg,
    borderColor: COLORS.headerBg,
  },
  chipText: {
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
  },
  chipTextSelected: {
    color: COLORS.white,
  },
});
