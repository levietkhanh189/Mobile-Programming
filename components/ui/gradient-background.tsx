import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GRADIENT_COLORS } from '../../constants/theme-colors';

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: readonly string[];
  className?: string;
  useSafeArea?: boolean;
}

/**
 * Full-screen gradient background for glassmorphism design
 *
 * @param colors - Optional gradient colors (defaults to authBackground)
 * @param useSafeArea - Wrap children in SafeAreaView (default: true)
 * @param className - NativeWind classes for outer container
 */
export function GradientBackground({
  children,
  colors = GRADIENT_COLORS.authBackground,
  className = '',
  useSafeArea = true,
}: GradientBackgroundProps) {
  const Wrapper = useSafeArea ? SafeAreaView : View;
  // LinearGradient requires at least 2 colors as a tuple
  const gradientColors = [...colors] as [string, string, ...string[]];

  return (
    <LinearGradient
      colors={gradientColors}
      start={[0, 0]}
      end={[1, 1]}
      style={{ flex: 1 }}
    >
      <Wrapper className={`flex-1 ${className}`}>
        {children}
      </Wrapper>
    </LinearGradient>
  );
}
