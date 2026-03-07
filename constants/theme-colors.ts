/**
 * Amazon-style Theme Colors
 * Simple, flat design with Amazon's signature color palette
 */
import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BASE_WIDTH = 393;

export const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;
export const responsive = (size: number) => Math.round(scale(size));

export const DEVICE = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 375,
  isIOS: Platform.OS === 'ios',
} as const;

/** Amazon color palette */
export const COLORS = {
  // Brand
  primary: '#FF9900',        // Amazon orange
  primaryDark: '#E88B00',    // Darker orange
  headerBg: '#131921',       // Amazon dark header
  headerText: '#FFFFFF',
  // Buttons
  btnYellow: '#FFD814',      // Amazon yellow button
  btnYellowBorder: '#FCD200',
  btnYellowPressed: '#F7CA00',
  btnOrange: '#FFA41C',      // Amazon orange button
  // Text
  text: '#0F1111',           // Primary text
  textSecondary: '#565959',  // Secondary text
  textMuted: '#888C8C',      // Muted text
  link: '#007185',           // Amazon teal link
  linkHover: '#C7511F',      // Orange link
  // Backgrounds
  background: '#EAEDED',     // Amazon light gray
  white: '#FFFFFF',
  // UI
  cardBg: '#FFFFFF',
  cardBorder: '#D5D9D9',
  divider: '#DDD',
  error: '#B12704',          // Amazon red/error price
  success: '#067D62',        // Amazon green
  warning: '#C45500',
  star: '#FFA41C',           // Star rating color
  priceBig: '#B12704',       // Sale price color
  priceWhole: '#0F1111',
} as const;

// Keep backward-compatible alias
export const GLASS_COLORS = COLORS;

export const SPACING = {
  xs: responsive(4),
  sm: responsive(8),
  md: responsive(12),
  lg: responsive(16),
  xl: responsive(24),
  xxl: responsive(32),
  screenPadding: responsive(14),
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
    sm: responsive(13),
    base: responsive(14),
    lg: responsive(16),
    xl: responsive(18),
    '2xl': responsive(21),
    '3xl': responsive(24),
    '4xl': responsive(28),
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

// Kept for backward compat — no longer used in new code
export const GLASS_EFFECTS = {
  blurIntensity: 0,
  borderWidth: 1,
  borderRadius: 8,
  borderRadiusSm: 4,
  borderRadiusLg: 8,
  shadowOpacity: 0.08,
  shadowRadius: 4,
  shadowColor: '#000',
} as const;

export const GRADIENT_COLORS = {
  authBackground: ['#131921', '#232F3E'],
  authBackgroundLight: ['#232F3E', '#37475A'],
  splash: ['#131921', '#232F3E'],
  card: ['#FFFFFF', '#FFFFFF'],
  tabBar: ['#FFFFFF', '#FFFFFF'],
} as const;
