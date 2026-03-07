import React, { memo, useCallback } from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { GLASS_COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';

interface CategoryListProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryChip = memo(function CategoryChip({
  label,
  selected,
  onPress,
  index,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  index: number;
}) {
  return (
    <Animated.View entering={FadeInRight.duration(400).delay(index * 60)}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.chip, selected && styles.chipSelected]}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={`Category: ${label}`}
      >
        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

export const CategoryList = memo(function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  const handlePress = useCallback(
    (cat: string) => onSelectCategory(cat),
    [onSelectCategory]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CategoryChip
          label="All"
          selected={selectedCategory === 'All'}
          onPress={() => handlePress('All')}
          index={0}
        />
        {categories.map((category, idx) => (
          <CategoryChip
            key={category}
            label={category}
            selected={selectedCategory === category}
            onPress={() => handlePress(category)}
            index={idx + 1}
          />
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: GLASS_COLORS.text,
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.screenPadding,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: GLASS_COLORS.white,
    borderWidth: 1.5,
    borderColor: GLASS_COLORS.cardBorder,
    ...SHADOWS.sm,
  },
  chipSelected: {
    backgroundColor: GLASS_COLORS.primary,
    borderColor: GLASS_COLORS.primary,
  },
  chipText: {
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: GLASS_COLORS.text,
  },
  chipTextSelected: {
    color: GLASS_COLORS.white,
  },
});
