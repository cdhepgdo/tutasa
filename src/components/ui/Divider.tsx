import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../../constants/theme';

export function Divider({ style, ...rest }: ViewProps) {
  return <View style={[styles.divider, style]} {...rest} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    width: '100%',
    marginVertical: theme.spacing.m,
  }
});
