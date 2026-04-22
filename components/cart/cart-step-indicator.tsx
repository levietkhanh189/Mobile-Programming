import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

type StepKey = 'cart' | 'checkout' | 'done';

interface Props {
  current: StepKey;
}

const STEPS: { key: StepKey; label: string }[] = [
  { key: 'cart', label: 'Giỏ hàng' },
  { key: 'checkout', label: 'Thanh toán' },
  { key: 'done', label: 'Hoàn tất' },
];

export default function CartStepIndicator({ current }: Props) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <View style={styles.container}>
      {STEPS.map((step, idx) => {
        const isActive = idx === currentIndex;
        const isDone = idx < currentIndex;
        return (
          <React.Fragment key={step.key}>
            <View style={styles.stepWrap}>
              <View
                style={[
                  styles.circle,
                  isActive && styles.circleActive,
                  isDone && styles.circleDone,
                ]}
              >
                <Text
                  style={[
                    styles.circleText,
                    (isActive || isDone) && styles.circleTextActive,
                  ]}
                >
                  {isDone ? '✓' : idx + 1}
                </Text>
              </View>
              <Text
                style={[
                  styles.label,
                  (isActive || isDone) && styles.labelActive,
                ]}
                numberOfLines={1}
              >
                {step.label}
              </Text>
            </View>
            {idx < STEPS.length - 1 && (
              <View style={[styles.line, idx < currentIndex && styles.lineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  stepWrap: { alignItems: 'center', minWidth: 64 },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  circleDone: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success,
  },
  circleText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
  },
  circleTextActive: {
    color: COLORS.white,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 4,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  labelActive: {
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.cardBorder,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  lineDone: { backgroundColor: COLORS.success },
});
