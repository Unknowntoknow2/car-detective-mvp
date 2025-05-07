
/**
 * Car Detective UI Kit - Design Tokens
 * Isolated design system for the Car Detective platform
 */

// Spacing scale
export const spacing = {
  'xs': '4px',
  'sm': '8px',
  'md': '16px',
  'lg': '24px',
  'xl': '32px',
  '2xl': '48px',
  '3xl': '64px',
};

// Color palette
export const colors = {
  // Primary colors
  primary: {
    DEFAULT: '#023047', // Navy
    light: '#194964',
    dark: '#011E33',
    contrast: '#FFFFFF',
  },
  
  // Accent colors
  accent: {
    DEFAULT: '#00b894', // Emerald
    light: '#1FCAA6',
    dark: '#00A083',
    contrast: '#FFFFFF',
  },
  
  // Neutral colors
  neutral: {
    lightest: '#FFFFFF',
    lighter: '#F7F9FC',
    light: '#E5E9F0',
    DEFAULT: '#C4C9D4',
    dark: '#6C7A89',
    darker: '#4A5568',
    darkest: '#333333',
  },
  
  // Feedback colors
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
};

// Border radius
export const radii = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  full: '9999px',
};

// Typography
export const typography = {
  fontFamily: {
    primary: 'Inter, Helvetica, sans-serif',
  },
  fontSize: {
    xs: '12px',    // Caption
    sm: '14px',    // BodyS
    base: '16px',  // BodyM
    lg: '18px',    // Subheading
    xl: '20px',    // HeadingS
    '2xl': '24px', // HeadingM
    '3xl': '30px', // HeadingL
    '4xl': '36px', // HeadingXL
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.2',
    base: '1.5',
    relaxed: '1.75',
  }
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

// Animation
export const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    ease: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
    easeIn: 'cubic-bezier(0.42, 0, 1.0, 1.0)',
    easeOut: 'cubic-bezier(0, 0, 0.58, 1.0)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1.0)',
  },
};

// Breakpoints (for responsive design)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Z-index scale
export const zIndices = {
  base: 0,
  elevated: 1,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
};
