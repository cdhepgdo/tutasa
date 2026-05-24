export const colors = {
  // Base dark theme colors (Slate/Zinc vibe)
  background: '#09090b', // Zinc 950
  surface: '#18181b',    // Zinc 900
  surfaceHighlight: '#27272a', // Zinc 800
  
  // Text
  text: '#fafafa',       // Zinc 50
  textMuted: '#a1a1aa',  // Zinc 400
  
  // Accents
  primary: '#eab308',    // Yellow 500 (Gold/Professional accent)
  primaryDark: '#ca8a04', // Yellow 600
  
  // Status
  success: '#22c55e',    // Green 500
  error: '#ef4444',      // Red 500
  warning: '#f59e0b',    // Amber 500
  
  // Borders & Dividers
  border: '#3f3f46',     // Zinc 700
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  sizes: {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 24,
    xxl: 32,
    huge: 48,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const borderRadius = {
  s: 4,
  m: 8,
  l: 12,
  xl: 16,
  round: 9999,
};

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
};

export type Theme = typeof theme;
