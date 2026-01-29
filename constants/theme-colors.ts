/**
 * Glassmorphism Theme Colors
 * Single source of truth for color system
 */

export const GLASS_COLORS = {
  primary: '#4F46E5',        // Indigo
  primaryLight: '#818CF8',   // Light purple
  primaryDark: '#3730A3',    // Dark indigo
  cta: '#F97316',            // Orange
  background: '#EEF2FF',     // Light lavender
  text: '#1E1B4B',           // Dark indigo
  textSecondary: '#6366F1',  // Medium indigo
  surface: 'rgba(255, 255, 255, 0.25)',  // Glass surface
  surfaceBorder: 'rgba(255, 255, 255, 0.4)', // Glass border
  error: '#EF4444',
  success: '#10B981',
  white: '#FFFFFF',
  overlay: 'rgba(255, 255, 255, 0.15)',  // Glass overlay
} as const;

export const GLASS_EFFECTS = {
  blurIntensity: 15,        // blur amount in px
  borderWidth: 1.5,
  borderRadius: 20,
  shadowOpacity: 0.1,
  shadowRadius: 20,
  shadowColor: '#000000',
} as const;

export const GRADIENT_COLORS = {
  authBackground: ['#4F46E5', '#818CF8', '#C7D2FE', '#EEF2FF'],
  authBackgroundLight: ['#6366F1', '#A5B4FC', '#DDD6FE', '#F5F3FF'],
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    poppins: {
      regular: 'Poppins_400Regular',
      medium: 'Poppins_500Medium',
      semibold: 'Poppins_600SemiBold',
      bold: 'Poppins_700Bold',
    },
    openSans: {
      regular: 'OpenSans_400Regular',
      semibold: 'OpenSans_600SemiBold',
    },
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;
