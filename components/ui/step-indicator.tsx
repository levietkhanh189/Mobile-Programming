import React from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { GLASS_COLORS } from '../../constants/theme-colors';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number; // 0-indexed
  labels?: string[];
  className?: string;
}

interface StepDotProps {
  isActive: boolean;
  isCompleted: boolean;
  label?: string;
}

/**
 * Individual animated step dot component
 */
function StepDot({ isActive, isCompleted, label }: StepDotProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(isActive ? 1.2 : 1, {
          damping: 15,
          stiffness: 300,
        }),
      },
    ],
  }));

  return (
    <View className="items-center">
      <Animated.View
        style={[
          animatedStyle,
          {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: isActive
              ? GLASS_COLORS.cta
              : isCompleted
              ? GLASS_COLORS.primary
              : GLASS_COLORS.surface,
          },
        ]}
      />
      {label && (
        <Text
          style={{
            marginTop: 4,
            fontSize: 10,
            color: isActive || isCompleted
              ? GLASS_COLORS.white
              : 'rgba(255, 255, 255, 0.5)',
            fontFamily: 'OpenSans_400Regular',
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

/**
 * Horizontal step indicator with animated dots
 *
 * @param totalSteps - Total number of steps
 * @param currentStep - Current active step (0-indexed)
 * @param labels - Optional step labels
 */
export function StepIndicator({
  totalSteps,
  currentStep,
  labels,
  className = '',
}: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i);

  return (
    <View className={`flex-row items-center justify-center py-4 ${className}`}>
      {steps.map((step, index) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <View key={step} className="flex-row items-center">
            <StepDot
              isActive={isActive}
              isCompleted={isCompleted}
              label={labels?.[step]}
            />
            {index < totalSteps - 1 && (
              <View
                style={{
                  width: 32,
                  height: 2,
                  marginHorizontal: 8,
                  backgroundColor: isCompleted
                    ? GLASS_COLORS.primary
                    : GLASS_COLORS.surface,
                }}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}
