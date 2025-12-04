/**
 * Design System Theme
 * Based on eco-energy/sustainability company best practices
 * Optimized for field technician use (high contrast, large touch targets)
 */

export const theme = {
  // Color Palette
  colors: {
    // Primary - Green (eco-friendly, growth, sustainability)
    primary: {
      main: '#2D5F3F',       // Deep forest green - stability, trust
      light: '#3D7F5F',      // Lighter shade for hover states
      dark: '#1D4F2F',       // Darker shade for pressed states
      contrast: '#FFFFFF',   // White text on primary
    },

    // Secondary - Vibrant Green
    secondary: {
      main: '#4CAF50',       // Material green - energy, positive action
      light: '#6FBF73',      // Lighter for backgrounds
      dark: '#3D8B40',       // Darker for emphasis
      contrast: '#FFFFFF',
    },

    // Accent - Blue (energy, utilities, professionalism)
    accent: {
      main: '#0066CC',       // Utility blue - trust, tech
      light: '#3385D6',
      dark: '#004C99',
      contrast: '#FFFFFF',
    },

    // Tertiary - Earth tones
    tertiary: {
      main: '#8B7355',       // Warm brown - natural, grounded
      light: '#A58B6F',
      dark: '#6B5335',
      contrast: '#FFFFFF',
    },

    // Neutral/Gray Scale
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },

    // Semantic Colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',

    // Backgrounds
    background: {
      default: '#FAFAFA',    // Light gray - reduces eye strain
      paper: '#FFFFFF',      // White cards/surfaces
      elevated: '#FFFFFF',   // Elevated components
    },

    // Text
    text: {
      primary: '#212121',
      secondary: '#616161',
      disabled: '#9E9E9E',
      hint: '#BDBDBD',
    },

    // Borders
    border: {
      light: '#E0E0E0',
      main: '#BDBDBD',
      dark: '#757575',
    },

    // Special
    overlay: 'rgba(0, 0, 0, 0.5)',
    divider: '#E0E0E0',
  },

  // Typography
  typography: {
    fontFamily: {
      // React Native defaults (SF Pro on iOS, Roboto on Android)
      regular: 'System',
      medium: 'System',
      bold: 'System',
      light: 'System',
    },

    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
      '5xl': 36,
    },

    fontWeight: {
      light: '300' as const,
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },

    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },

  // Spacing (8px base unit)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },

  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },

  // Shadows (elevation)
  shadows: {
    none: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.20,
      shadowRadius: 1.5,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.22,
      shadowRadius: 3.0,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 4.0,
      elevation: 6,
    },
  },

  // Component-specific sizing
  components: {
    button: {
      height: {
        sm: 36,
        md: 44,  // Minimum touch target
        lg: 56,
      },
      paddingHorizontal: {
        sm: 12,
        md: 20,
        lg: 28,
      },
    },

    input: {
      height: {
        sm: 36,
        md: 44,
        lg: 52,
      },
      paddingHorizontal: {
        sm: 12,
        md: 16,
        lg: 20,
      },
    },

    card: {
      padding: {
        sm: 12,
        md: 16,
        lg: 20,
      },
      borderRadius: 8,
    },

    // Minimum touch target size (accessibility)
    touchTarget: {
      minHeight: 44,
      minWidth: 44,
    },
  },

  // Layout
  layout: {
    containerPadding: 16,
    sectionSpacing: 24,
    screenPadding: 20,
    maxContentWidth: 768,
  },

  // Animation/Timing
  animation: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
    },
    easing: {
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
};

// Type exports for TypeScript
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeSpacing = typeof theme.spacing;

// Helper function to get spacing values
export const spacing = (...values: (keyof typeof theme.spacing)[]) => {
  return values.map(v => theme.spacing[v]).join(' ');
};

export default theme;
