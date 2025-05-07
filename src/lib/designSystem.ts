
/**
 * Car Detective™ Design System
 * 
 * A comprehensive design system for the Car Detective platform
 * following Apple-style minimalism and best practices from CarMax.
 */

// Color palette
export const colors = {
  // Primary
  primary: {
    DEFAULT: '#0062FF', // Cobalt blue
    hover: '#0051DB',
    light: '#E5F0FF',
    dark: '#004ECC',
    50: '#E5F0FF',
    100: '#CCE0FF',
    200: '#99C2FF',
    300: '#66A3FF',
    400: '#3385FF',
    500: '#0062FF', // Default
    600: '#0051DB',
    700: '#0041B8',
    800: '#003194',
    900: '#002171',
  },
  
  // Accent
  accent: {
    DEFAULT: '#10B981', // Emerald green
    hover: '#0EA874',
    light: '#D1FAE5',
    dark: '#059669',
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // Default
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  
  // Neutral
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Semantic
  success: {
    DEFAULT: '#10B981',
    light: '#D1FAE5',
    dark: '#059669',
  },
  warning: {
    DEFAULT: '#F59E0B',
    light: '#FEF3C7',
    dark: '#D97706',
  },
  error: {
    DEFAULT: '#EF4444',
    light: '#FEE2E2',
    dark: '#DC2626',
  },
  info: {
    DEFAULT: '#3B82F6',
    light: '#DBEAFE',
    dark: '#2563EB',
  },
  
  // Surfaces
  surface: {
    DEFAULT: '#F9FAFB',
    card: '#FFFFFF',
    dark: '#F3F4F6',
  },
  
  // Text
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    tertiary: '#9CA3AF',
    light: '#F9FAFB',
  },
};

// Typography
export const typography = {
  fontFamily: {
    sans: ['Inter', 'SF Pro Display', 'Helvetica Neue', 'sans-serif'].join(', '),
    mono: ['SF Mono', 'Menlo', 'monospace'].join(', '),
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
};

// Spacing
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem',     // 384px
};

// Border radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
  // Special shadows
  card: '0 2px 8px rgba(0, 0, 0, 0.05)',
  'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
  'button-primary': '0 2px 4px rgba(0, 98, 255, 0.2)',
  'button-primary-hover': '0 4px 6px rgba(0, 98, 255, 0.3)',
  'button-accent': '0 2px 4px rgba(16, 185, 129, 0.2)',
  'button-accent-hover': '0 4px 6px rgba(16, 185, 129, 0.3)',
};

// Transitions
export const transitions = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  timing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Z-index
export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  auto: 'auto',
  // Specific z-indices
  navbar: '100',
  modal: '200',
  tooltip: '300',
  dropdown: '100',
};

// Component-specific tokens
export const components = {
  // Button sizes
  button: {
    sm: {
      height: '32px',
      padding: '0 12px',
      fontSize: typography.fontSize.sm,
    },
    base: {
      height: '40px',
      padding: '0 16px',
      fontSize: typography.fontSize.base,
    },
    lg: {
      height: '48px',
      padding: '0 24px',
      fontSize: typography.fontSize.lg,
    },
    xl: {
      height: '56px',
      padding: '0 32px',
      fontSize: typography.fontSize.xl,
    },
  },
  
  // Card
  card: {
    padding: {
      sm: '16px',
      base: '24px',
      lg: '32px',
    },
    borderRadius: borderRadius.xl,
    shadow: shadows.card,
    shadowHover: shadows['card-hover'],
  },
  
  // Input
  input: {
    sm: {
      height: '32px',
      padding: '0 12px',
      fontSize: typography.fontSize.sm,
    },
    base: {
      height: '40px',
      padding: '0 16px',
      fontSize: typography.fontSize.base,
    },
    lg: {
      height: '48px',
      padding: '0 16px',
      fontSize: typography.fontSize.lg,
    },
  },
  
  // Header
  header: {
    xs: {
      fontSize: typography.fontSize.lg,
      lineHeight: typography.lineHeight.tight,
      fontWeight: typography.fontWeight.semibold,
    },
    sm: {
      fontSize: typography.fontSize.xl,
      lineHeight: typography.lineHeight.tight,
      fontWeight: typography.fontWeight.semibold,
    },
    base: {
      fontSize: typography.fontSize['2xl'],
      lineHeight: typography.lineHeight.tight,
      fontWeight: typography.fontWeight.bold,
    },
    lg: {
      fontSize: typography.fontSize['3xl'],
      lineHeight: typography.lineHeight.tight,
      fontWeight: typography.fontWeight.bold,
    },
    xl: {
      fontSize: typography.fontSize['4xl'],
      lineHeight: typography.lineHeight.tight,
      fontWeight: typography.fontWeight.bold,
    },
    '2xl': {
      fontSize: typography.fontSize['5xl'],
      lineHeight: typography.lineHeight.tight,
      fontWeight: typography.fontWeight.bold,
    },
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  components,
};
