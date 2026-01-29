import { MD3LightTheme } from 'react-native-paper';
import { GLASS_COLORS } from '../constants/theme-colors';

/**
 * Custom Paper theme with glassmorphism colors
 * Uses GLASS_COLORS as single source of truth
 */
export function useGlassmorphismTheme() {
  const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: GLASS_COLORS.primary,
      secondary: GLASS_COLORS.primaryLight,
      tertiary: GLASS_COLORS.cta,
      background: GLASS_COLORS.background,
      surface: GLASS_COLORS.white,
      surfaceVariant: GLASS_COLORS.overlay,
      error: GLASS_COLORS.error,
      onPrimary: GLASS_COLORS.white,
      onSecondary: GLASS_COLORS.white,
      onBackground: GLASS_COLORS.text,
      onSurface: GLASS_COLORS.text,
      onSurfaceVariant: GLASS_COLORS.textSecondary,
      outline: GLASS_COLORS.primaryLight,
      outlineVariant: GLASS_COLORS.surfaceBorder,
      inverseSurface: GLASS_COLORS.text,
      inverseOnSurface: GLASS_COLORS.white,
      inversePrimary: GLASS_COLORS.primaryLight,
      elevation: {
        level0: 'transparent',
        level1: GLASS_COLORS.white,
        level2: GLASS_COLORS.white,
        level3: GLASS_COLORS.white,
        level4: GLASS_COLORS.white,
        level5: GLASS_COLORS.white,
      },
    },
  };

  return theme;
}
