import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { GLASS_COLORS, GLASS_EFFECTS } from '../../constants/theme-colors';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

/**
 * Frosted glass card with blur effect (iOS) or semi-transparent fallback (Android)
 *
 * @param intensity - Blur intensity (default: 15)
 * @param className - NativeWind classes for container
 */
export function GlassCard({
  children,
  className = '',
  intensity = GLASS_EFFECTS.blurIntensity,
}: GlassCardProps) {
  const containerClasses = `rounded-[20px] overflow-hidden ${className}`;

  if (Platform.OS === 'ios') {
    return (
      <View className={containerClasses} style={styles.container}>
        <BlurView intensity={intensity} tint="light" style={styles.blurView}>
          <View className="p-6" style={styles.innerContainer}>
            {children}
          </View>
        </BlurView>
      </View>
    );
  }

  // Android fallback: semi-transparent white with shadow
  return (
    <View
      className={containerClasses}
      style={[styles.container, styles.androidFallback]}
    >
      <View className="p-6" style={styles.innerContainer}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: GLASS_EFFECTS.borderWidth,
    borderColor: GLASS_COLORS.surfaceBorder,
    shadowColor: GLASS_EFFECTS.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: GLASS_EFFECTS.shadowOpacity,
    shadowRadius: GLASS_EFFECTS.shadowRadius,
    elevation: 8, // Android shadow
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
