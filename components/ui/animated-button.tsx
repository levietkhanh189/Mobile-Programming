import React, { memo, useCallback } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { GLASS_COLORS, SHADOWS } from '../../constants/theme-colors';

interface AnimatedButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'cta' | 'outline' | 'text';
  className?: string;
  accessibilityHint?: string;
}

const SPRING_CONFIG = { damping: 15, stiffness: 300 };

const VARIANT_STYLES = {
  primary: {
    backgroundColor: GLASS_COLORS.primary,
    borderWidth: 0,
    borderColor: 'transparent',
    textColor: GLASS_COLORS.white,
  },
  cta: {
    backgroundColor: GLASS_COLORS.cta,
    borderWidth: 0,
    borderColor: 'transparent',
    textColor: GLASS_COLORS.white,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: GLASS_COLORS.primaryLight,
    textColor: GLASS_COLORS.white,
  },
  text: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    textColor: GLASS_COLORS.primaryLight,
  },
} as const;

/**
 * Animated button with spring scale + haptic feedback
 */
export const AnimatedButton = memo(function AnimatedButton({
  onPress,
  title,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
  accessibilityHint,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.96, SPRING_CONFIG);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [disabled, loading, scale]);

  const handlePressOut = useCallback(() => {
    if (!disabled && !loading) {
      scale.value = withSpring(1, SPRING_CONFIG);
    }
  }, [disabled, loading, scale]);

  const currentVariant = VARIANT_STYLES[variant];

  return (
    <Animated.View style={[animatedStyle, { opacity: disabled ? 0.5 : 1 }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        className={className}
        style={[
          styles.button,
          {
            backgroundColor: currentVariant.backgroundColor,
            borderWidth: currentVariant.borderWidth,
            borderColor: currentVariant.borderColor,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
      >
        {loading ? (
          <ActivityIndicator color={currentVariant.textColor} />
        ) : (
          <Text style={[styles.text, { color: currentVariant.textColor }]}>
            {title}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.3,
  },
});
