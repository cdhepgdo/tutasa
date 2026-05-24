import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacityProps 
} from 'react-native';
import { theme } from '../../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export function Button({ 
  title, 
  variant = 'primary', 
  isLoading = false, 
  style, 
  disabled,
  ...rest 
}: ButtonProps) {
  
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.surfaceHighlight;
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.surfaceHighlight;
      case 'danger': return theme.colors.error;
      case 'outline': return 'transparent';
      default: return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textMuted;
    switch (variant) {
      case 'primary': return '#000000'; // Dark text on yellow primary
      case 'outline': return theme.colors.primary;
      default: return theme.colors.text;
    }
  };

  const getBorderColor = () => {
    if (disabled) return 'transparent';
    if (variant === 'outline') return theme.colors.primary;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style
      ]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: theme.borderRadius.m,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
    flexDirection: 'row',
  },
  text: {
    fontSize: theme.typography.sizes.m,
    fontWeight: theme.typography.weights.semibold,
  }
});
