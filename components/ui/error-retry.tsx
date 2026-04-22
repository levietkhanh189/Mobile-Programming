import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

interface ErrorRetryProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorRetry = ({
  message = 'Đã xảy ra lỗi, vui lòng thử lại',
  onRetry,
}: ErrorRetryProps) => (
  <View style={styles.container}>
    <IconSymbol name="exclamationmark.circle" size={48} color={COLORS.error} />
    <Text style={styles.message}>{message}</Text>
    <TouchableOpacity style={styles.btn} onPress={onRetry} accessibilityRole="button" accessibilityLabel="Thử lại">
      <Text style={styles.btnText}>Thử lại</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: COLORS.btnYellow,
    borderWidth: 1,
    borderColor: COLORS.btnYellowBorder,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  btnText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
});
