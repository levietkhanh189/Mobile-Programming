import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

export type PromoResult =
  | { type: 'percent_off'; code: string; value: number }   // value = fraction e.g. 0.10
  | { type: 'free_shipping'; code: string }
  | null;

const VALID_CODES: Record<string, PromoResult> = {
  WELCOME10: { type: 'percent_off', code: 'WELCOME10', value: 0.1 },
  FREESHIP: { type: 'free_shipping', code: 'FREESHIP' },
};

const SUGGESTIONS: { code: string; description: string }[] = [
  { code: 'WELCOME10', description: 'Giảm 10%' },
  { code: 'FREESHIP', description: 'Miễn phí ship' },
];

interface Props {
  onApply: (result: PromoResult) => void;
  appliedPromo: PromoResult;
}

export default function PromoCodeInput({ onApply, appliedPromo }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const applyCode = (raw: string) => {
    const trimmed = raw.trim().toUpperCase();
    if (!trimmed) {
      setError('Vui lòng nhập mã giảm giá');
      return;
    }
    const result = VALID_CODES[trimmed] ?? null;
    if (result) {
      setError('');
      setInput('');
      onApply(result);
    } else {
      setError('Mã không hợp lệ hoặc đã hết hạn');
      onApply(null);
    }
  };

  const handleApply = () => applyCode(input);
  const handlePickSuggestion = (code: string) => applyCode(code);

  const handleRemove = () => {
    setInput('');
    setError('');
    onApply(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <IconSymbol name="tag.fill" size={18} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>Mã giảm giá</Text>
      </View>

      {appliedPromo ? (
        <View style={styles.appliedRow}>
          <IconSymbol name="checkmark" size={16} color={COLORS.success} />
          <Text style={styles.appliedText}>
            {appliedPromo.type === 'percent_off'
              ? `Đã áp dụng ${appliedPromo.code} — Giảm ${appliedPromo.value * 100}%`
              : `Đã áp dụng ${appliedPromo.code} — Miễn phí vận chuyển`}
          </Text>
          <TouchableOpacity onPress={handleRemove} accessibilityRole="button">
            <Text style={styles.removeText}>Bỏ</Text>
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

          <Text style={styles.suggestLabel}>Mã có sẵn — chạm để áp dụng</Text>
          <View style={styles.chipsRow}>
            {SUGGESTIONS.map((s) => (
              <TouchableOpacity
                key={s.code}
                onPress={() => handlePickSuggestion(s.code)}
                style={styles.chip}
                accessibilityRole="button"
                accessibilityLabel={`Áp dụng mã ${s.code}`}
              >
                <Text style={styles.chipCode}>{s.code}</Text>
                <Text style={styles.chipDesc}>{s.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text,
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
    backgroundColor: COLORS.white,
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
  suggestLabel: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    backgroundColor: '#FFF8F0',
    borderRadius: 6,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },
  chipCode: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.warning,
  },
  chipDesc: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: '#E6F5EE',
    borderWidth: 1,
    borderColor: COLORS.success,
    borderRadius: 8,
    padding: SPACING.md,
  },
  appliedText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.success,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
  },
  removeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.error,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
  },
});
