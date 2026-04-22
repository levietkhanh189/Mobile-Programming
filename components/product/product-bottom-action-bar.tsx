import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

interface Props {
  onAddToCart: () => void;
  onBuyNow: () => void;
  disabled?: boolean;
}

export default function ProductBottomActionBar({ onAddToCart, onBuyNow, disabled = false }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, SPACING.md) }]}>
      <TouchableOpacity
        style={[styles.btn, styles.btnOutlined, disabled && styles.btnDisabled]}
        onPress={onAddToCart}
        disabled={disabled}
        accessibilityLabel="Thêm vào giỏ hàng"
      >
        <Text style={[styles.btnText, styles.btnOutlinedText]}>Thêm vào giỏ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.btnFilled, disabled && styles.btnDisabled]}
        onPress={onBuyNow}
        disabled={disabled}
        accessibilityLabel="Mua ngay"
      >
        <Text style={[styles.btnText, styles.btnFilledText]}>Mua ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlined: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  btnFilled: {
    backgroundColor: COLORS.btnYellow,
    borderWidth: 1.5,
    borderColor: COLORS.btnYellowBorder,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
  },
  btnOutlinedText: {
    color: COLORS.primary,
  },
  btnFilledText: {
    color: COLORS.text,
  },
});
