import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

export type PromoResult =
  | { type: 'percent_off'; code: string; value: number }   // value = fraction e.g. 0.10
  | { type: 'free_shipping'; code: string }
  | null;

const VALID_CODES: Record<string, PromoResult> = {
  WELCOME10: { type: 'percent_off', code: 'WELCOME10', value: 0.1 },
  FREESHIP: { type: 'free_shipping', code: 'FREESHIP' },
};

interface Props {
  onApply: (result: PromoResult) => void;
  appliedPromo: PromoResult;
}

export default function PromoCodeInput({ onApply, appliedPromo }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleApply = () => {
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) {
      setError('Vui lòng nhập mã giảm giá');
      return;
    }
    const result = VALID_CODES[trimmed] ?? null;
    if (result) {
      setError('');
      onApply(result);
    } else {
      setError('Mã không hợp lệ');
      onApply(null);
    }
  };

  const handleRemove = () => {
    setInput('');
    setError('');
    onApply(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mã giảm giá</Text>
      {appliedPromo ? (
        <View style={styles.appliedRow}>
          <Text style={styles.appliedText}>
            {appliedPromo.type === 'percent_off'
              ? `Giảm ${appliedPromo.value * 100}% — ${appliedPromo.code}`
              : `Miễn phí vận chuyển — ${appliedPromo.code}`}
          </Text>
          <TouchableOpacity onPress={handleRemove} accessibilityRole="button">
            <Text style={styles.removeText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={(t) => { setInput(t); setError(''); }}
              placeholder="Nhập mã giảm giá"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="characters"
              returnKeyType="done"
              onSubmitEditing={handleApply}
            />
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={handleApply}
              accessibilityRole="button"
            >
              <Text style={styles.applyText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
    padding: SPACING.screenPadding,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  applyBtn: {
    backgroundColor: COLORS.btnYellow,
    borderWidth: 1,
    borderColor: COLORS.btnYellowBorder,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  applyText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  errorText: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error,
  },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FFF4',
    borderWidth: 1,
    borderColor: COLORS.success,
    borderRadius: 8,
    padding: SPACING.md,
  },
  appliedText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.success,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    flex: 1,
  },
  removeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.error,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    marginLeft: SPACING.sm,
  },
});
