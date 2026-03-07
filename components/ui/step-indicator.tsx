import React from 'react';
import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { COLORS } from '../../constants/theme-colors';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
  labels?: string[];
  className?: string;
}

function StepDot({ isActive, isCompleted, label }: { isActive: boolean; isCompleted: boolean; label?: string }) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isActive ? 1.2 : 1, { damping: 15, stiffness: 300 }) }],
  }));

  return (
    <View className="items-center">
      <Animated.View
        style={[animatedStyle, {
          width: 12, height: 12, borderRadius: 6,
          backgroundColor: isActive ? COLORS.primary : isCompleted ? COLORS.headerBg : COLORS.cardBorder,
        }]}
      />
      {label && (
        <Text style={{ marginTop: 4, fontSize: 10, color: isActive || isCompleted ? COLORS.text : COLORS.textMuted, fontFamily: 'OpenSans_400Regular' }}>
          {label}
        </Text>
      )}
    </View>
  );
}

export function StepIndicator({ totalSteps, currentStep, labels, className = '' }: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i);

  return (
    <View className={`flex-row items-center justify-center py-4 ${className}`}>
      {steps.map((step, index) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        return (
          <View key={step} className="flex-row items-center">
            <StepDot isActive={isActive} isCompleted={isCompleted} label={labels?.[step]} />
            {index < totalSteps - 1 && (
              <View style={{ width: 32, height: 2, marginHorizontal: 8, backgroundColor: isCompleted ? COLORS.headerBg : COLORS.cardBorder }} />
            )}
          </View>
        );
      })}
    </View>
  );
}
