import React, { memo, useCallback } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS } from '../../constants/theme-colors';

interface AnimatedButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'cta' | 'outline' | 'text';
  className?: string;
  accessibilityHint?: string;
}

const SPRING = { damping: 15, stiffness: 300 };

const VARIANTS = {
  primary: { backgroundColor: COLORS.headerBg, borderWidth: 0, borderColor: 'transparent', textColor: COLORS.white },
  cta: { backgroundColor: COLORS.btnYellow, borderWidth: 1, borderColor: COLORS.btnYellowBorder, textColor: COLORS.text },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.cardBorder, textColor: COLORS.text },
  text: { backgroundColor: 'transparent', borderWidth: 0, borderColor: 'transparent', textColor: COLORS.link },
} as const;

export const AnimatedButton = memo(function AnimatedButton({
  onPress, title, loading = false, disabled = false, variant = 'primary', className = '', accessibilityHint,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const onIn = useCallback(() => {
    if (!disabled && !loading) { scale.value = withSpring(0.97, SPRING); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }
  }, [disabled, loading, scale]);
  const onOut = useCallback(() => {
    if (!disabled && !loading) scale.value = withSpring(1, SPRING);
  }, [disabled, loading, scale]);

  const v = VARIANTS[variant];
  return (
    <Animated.View style={[animStyle, { opacity: disabled ? 0.5 : 1 }]}>
      <Pressable onPress={onPress} onPressIn={onIn} onPressOut={onOut} disabled={disabled || loading}
        className={className}
        style={[styles.btn, { backgroundColor: v.backgroundColor, borderWidth: v.borderWidth, borderColor: v.borderColor }]}
        accessibilityRole="button" accessibilityLabel={title} accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: disabled || loading, busy: loading }}>
        {loading ? <ActivityIndicator color={v.textColor} /> : <Text style={[styles.text, { color: v.textColor }]}>{title}</Text>}
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  btn: { minHeight: 46, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center', ...SHADOWS.sm },
  text: { fontSize: 14, fontWeight: '600', fontFamily: 'Poppins_600SemiBold' },
});
