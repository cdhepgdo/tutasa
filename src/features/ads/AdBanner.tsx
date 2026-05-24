import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { config } from '../../constants/config';
import { theme } from '../../constants/theme';

export function AdBanner() {
  if (!config.ADS_ENABLED) {
    return null; // En la Fase 1 y 2, los anuncios no existen en la UI
  }

  // Placeholder visual para desarrollo (cuando ADS_ENABLED sea true pero no esté el plugin)
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Espacio Publicitario (AdMob)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: theme.colors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.m,
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.s,
  }
});
