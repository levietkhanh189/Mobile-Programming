import React, { memo } from 'react';
import { View, StyleSheet, AccessibilityProps } from 'react-native';
import { COLORS, SHADOWS } from '../../constants/theme-colors';

interface GlassCardProps extends AccessibilityProps {
  children: React.ReactNode;
  className?: string;
  padding?: number;
}

/** Simple card component — flat Amazon style */
export const GlassCard = memo(function GlassCard({
  children,
  className = '',
  padding = 20,
  ...a11yProps
}: GlassCardProps) {
  return (
    <View
      className={`rounded overflow-hidden ${className}`}
      style={[styles.container, { padding }]}
      accessible
      accessibilityRole="none"
      {...a11yProps}
    >
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 4,
    ...SHADOWS.sm,
  },
});
