/**
 * Glassmorphism Theme Colors
 * Single source of truth for color system, responsive utilities, and design tokens
 */
import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Reference devices: iPhone 16 Pro (393x852), Galaxy S25 (360x780)
const BASE_WIDTH = 393;

/** Scale a value relative to screen width for responsive sizing */
export const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

/** Responsive value: returns iPhone value scaled proportionally */
export const responsive = (size: number) => Math.round(scale(size));

export const DEVICE = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 375,
  isIOS: Platform.OS === 'ios',
} as const;

export const GLASS_COLORS = {
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryDark: '#3730A3',
  cta: '#F97316',
  ctaLight: '#FB923C',
  background: '#EEF2FF',
  backgroundDark: '#F8FAFC',
  text: '#1E1B4B',
  textSecondary: '#6366F1',
  textMuted: '#94A3B8',
  surface: 'rgba(255, 255, 255, 0.25)',
  surfaceLight: 'rgba(255, 255, 255, 0.08)',
  surfaceBorder: 'rgba(255, 255, 255, 0.4)',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  white: '#FFFFFF',
  black: '#0F172A',
  overlay: 'rgba(255, 255, 255, 0.15)',
  cardBg: '#FFFFFF',
  cardBorder: '#F1F5F9',
  divider: '#E2E8F0',
} as const;

export const GLASS_EFFECTS = {
  blurIntensity: 20,
  borderWidth: 1.5,
  borderRadius: 20,
  borderRadiusSm: 12,
  borderRadiusLg: 28,
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowColor: '#000000',
} as const;

export const GRADIENT_COLORS = {
  authBackground: ['#4F46E5', '#818CF8', '#C7D2FE', '#EEF2FF'],
  authBackgroundLight: ['#6366F1', '#A5B4FC', '#DDD6FE', '#F5F3FF'],
  splash: ['#3730A3', '#4F46E5', '#818CF8', '#C7D2FE'],
  card: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)'],
  tabBar: ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)'],
} as const;

export const SPACING = {
  xs: responsive(4),
  sm: responsive(8),
  md: responsive(16),
  lg: responsive(24),
  xl: responsive(32),
  xxl: responsive(48),
  screenPadding: responsive(20),
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
    xs: responsive(12),
    sm: responsive(14),
    base: responsive(16),
    lg: responsive(18),
    xl: responsive(20),
    '2xl': responsive(24),
    '3xl': responsive(30),
    '4xl': responsive(36),
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

/** Common shadow presets for consistent elevation */
export const SHADOWS = {
  sm: {
    shadowColor: GLASS_EFFECTS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: GLASS_EFFECTS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: GLASS_EFFECTS.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;
