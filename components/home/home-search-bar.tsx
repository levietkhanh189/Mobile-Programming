import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';
import { router } from 'expo-router';

export const HomeSearchBar = () => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/products' as any)}
      activeOpacity={0.8}
      accessibilityRole="search"
      accessibilityLabel="Tìm kiếm sản phẩm"
    >
      <View style={styles.inner}>
        <IconSymbol name="magnifyingglass" size={18} color={COLORS.textMuted} />
        <Text style={styles.placeholder}>Tìm kiếm sản phẩm...</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.screenPadding,
    marginVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.sm,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    gap: 8,
  },
  placeholder: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: COLORS.textMuted,
  },
});
