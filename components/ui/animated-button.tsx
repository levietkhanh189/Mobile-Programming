import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { GLASS_COLORS } from '../../constants/theme-colors';

interface AnimatedButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'cta' | 'outline' | 'text';
  className?: string;
  icon?: string;
}

/**
 * Animated button with scale effect on press
 *
 * @param variant - Button style (primary, cta, outline, text)
 * @param loading - Show loading spinner
 */
export function AnimatedButton({
  onPress,
  title,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const variantStyles = {
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
      borderColor: GLASS_COLORS.primary,
      textColor: GLASS_COLORS.white,
    },
    text: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderColor: 'transparent',
      textColor: GLASS_COLORS.primaryLight,
    },
  };

  const currentVariant = variantStyles[variant];

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
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});
