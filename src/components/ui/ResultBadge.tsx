import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/theme';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';

interface ResultBadgeProps {
  label: string;
  value: string;
  onCopied?: () => void;
}

export function ResultBadge({ label, value, onCopied }: ResultBadgeProps) {
  const { t } = useTranslation();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(value);
    if (onCopied) {
      onCopied();
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handleCopy} style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        {/* Placeholder for copy icon, we will use vector icons later if needed */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surfaceHighlight,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginVertical: theme.spacing.xs,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.xs,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.l,
    fontWeight: theme.typography.weights.semibold,
  }
});
