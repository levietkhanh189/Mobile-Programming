import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

interface Props {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}

export default function ProductQuantitySelector({ value, onChange, min = 1, max = 99 }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Số lượng:</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, value <= min && styles.btnDisabled]}
          onPress={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          accessibilityLabel="Giảm số lượng"
        >
          <Text style={[styles.btnText, value <= min && styles.btnTextDisabled]}>−</Text>
        </TouchableOpacity>

        <View style={styles.valueBox}>
          <Text style={styles.valueText}>{value}</Text>
        </View>

        <TouchableOpacity
          style={[styles.btn, value >= max && styles.btnDisabled]}
          onPress={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          accessibilityLabel="Tăng số lượng"
        >
          <Text style={[styles.btnText, value >= max && styles.btnTextDisabled]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 4,
    overflow: 'hidden',
  },
  btn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  btnDisabled: {
    backgroundColor: COLORS.background,
    opacity: 0.4,
  },
  btnText: {
    fontSize: 20,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    lineHeight: 24,
  },
  btnTextDisabled: {
    color: COLORS.textMuted,
  },
  valueBox: {
    minWidth: 48,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.sm,
  },
  valueText: {
    fontSize: 16,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
  },
});
