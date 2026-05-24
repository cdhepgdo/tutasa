import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import { currencyHelpers } from '../../utils/currency';

interface RateDisplayProps {
  label: string;
  rate: number;
  decimals?: number;
  highlight?: boolean;
}

export function RateDisplay({ label, rate, decimals = 2, highlight = false }: RateDisplayProps) {
  return (
    <View style={[styles.container, highlight && styles.highlightContainer]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.rateContainer}>
        <Text style={styles.bs}>Bs. </Text>
        <Text style={[styles.rate, highlight && styles.highlightRate]}>
          {currencyHelpers.formatRate(rate, decimals)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  highlightContainer: {
    backgroundColor: theme.colors.surfaceHighlight,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.s,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bs: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.m,
    marginBottom: 4,
    marginRight: 2,
  },
  rate: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
  },
  highlightRate: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.huge,
  }
});
