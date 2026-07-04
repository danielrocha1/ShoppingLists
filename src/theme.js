// Cores inspiradas no Ant Design 6
// Harmonizadas para funcionar em React Native e Web
export const colors = {
  // Primary: azul antd
  primary: '#1677FF',
  primaryHover: '#4096FF',
  primaryActive: '#0958D9',
  primaryBg: '#E6F4FF',
  
  // Neutrals
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#595959',
  textMuted: '#8C8C8C',
  textDisabled: '#BFBFBF',
  
  // Status
  success: '#52C41A',
  successBg: '#F6FFED',
  warning: '#FAAD14',
  warningBg: '#FFFBE6',
  danger: '#FF4D4F',
  dangerBg: '#FFF2F0',
  info: '#1677FF',
  
  // Borders & fills
  border: '#D9D9D9',
  borderSecondary: '#F0F0F0',
  subtle: '#FAFAFA',
  fill: 'rgba(0, 0, 0, 0.06)',
  fillSecondary: 'rgba(0, 0, 0, 0.04)',
  
  // Gradiente
  gradientStart: '#1677FF',
  gradientEnd: '#0958D9',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  xxl: 16,
  pill: 999,
};

export const fontSize = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 30,
  display: 38,
};

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const shadow = {
  card: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  elevated: {
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  floating: {
    elevation: 8,
    shadowColor: '#1677FF',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
};