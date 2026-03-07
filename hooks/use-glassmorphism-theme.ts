import { MD3LightTheme } from 'react-native-paper';
import { COLORS } from '../constants/theme-colors';

/** Custom Paper theme using Amazon-style colors */
export function useGlassmorphismTheme() {
  return {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: COLORS.link,
      secondary: COLORS.primary,
      tertiary: COLORS.btnYellow,
      background: COLORS.background,
      surface: COLORS.white,
      surfaceVariant: COLORS.background,
      error: COLORS.error,
      onPrimary: COLORS.white,
      onSecondary: COLORS.white,
      onBackground: COLORS.text,
      onSurface: COLORS.text,
      onSurfaceVariant: COLORS.textSecondary,
      outline: COLORS.cardBorder,
      outlineVariant: COLORS.divider,
      inverseSurface: COLORS.headerBg,
      inverseOnSurface: COLORS.white,
      inversePrimary: COLORS.primary,
      elevation: {
        level0: 'transparent',
        level1: COLORS.white,
        level2: COLORS.white,
        level3: COLORS.white,
        level4: COLORS.white,
        level5: COLORS.white,
      },
    },
  };
}
