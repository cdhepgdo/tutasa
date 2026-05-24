import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import { useTranslation } from 'react-i18next';

interface OfflineBannerProps {
  isOffline: boolean;
}

export function OfflineBanner({ isOffline }: OfflineBannerProps) {
  const { t } = useTranslation();

  if (!isOffline) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('common.offline')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.warning,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000000', // Black text on amber background
    fontSize: theme.typography.sizes.s,
    fontWeight: theme.typography.weights.medium,
  }
});
