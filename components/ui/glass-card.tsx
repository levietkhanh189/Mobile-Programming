import React, { memo } from 'react';
import { View, Platform, StyleSheet, AccessibilityProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { GLASS_COLORS, GLASS_EFFECTS, SHADOWS } from '../../constants/theme-colors';

interface GlassCardProps extends AccessibilityProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  padding?: number;
}

/**
 * Frosted glass card with blur effect (iOS) or semi-transparent fallback (Android)
 */
export const GlassCard = memo(function GlassCard({
  children,
  className = '',
  intensity = GLASS_EFFECTS.blurIntensity,
  padding = 24,
  ...a11yProps
}: GlassCardProps) {
  const containerClasses = `rounded-[20px] overflow-hidden ${className}`;

  if (Platform.OS === 'ios') {
    return (
      <View
        className={containerClasses}
        style={styles.container}
        accessible
        accessibilityRole="none"
        {...a11yProps}
      >
        <BlurView intensity={intensity} tint="light" style={styles.blurView}>
          <View style={[styles.innerContainer, { padding }]}>
            {children}
          </View>
        </BlurView>
      </View>
    );
  }

  return (
    <View
      className={containerClasses}
      style={[styles.container, styles.androidFallback]}
      accessible
      accessibilityRole="none"
      {...a11yProps}
    >
      <View style={[styles.innerContainer, { padding }]}>
        {children}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderWidth: GLASS_EFFECTS.borderWidth,
    borderColor: GLASS_COLORS.surfaceBorder,
    ...SHADOWS.lg,
  },
  blurView: {
    flex: 1,
  },
  innerContainer: {
    backgroundColor: 'transparent',
  },
  androidFallback: {
    backgroundColor: GLASS_COLORS.surface,
  },
});
