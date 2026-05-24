import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeScreen } from '../../components/layout/SafeScreen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { useHistoryStore } from '../../features/history/historyStore';
import { useSettingsStore } from '../../features/settings/settingsStore';
import { currencyHelpers } from '../../utils/currency';
import { dateHelpers } from '../../utils/dateHelpers';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import { AdBanner } from '../../features/ads/AdBanner';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const snapshots = useHistoryStore(state => state.snapshots);
  const decimals = useSettingsStore(state => state.decimals);

  return (
    <SafeScreen>
      <ScreenHeader title={t('history.title')} />
      
      <AdBanner />

      {snapshots.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('history.noHistory')}</Text>
        </View>
      ) : (
        <FlatList
          data={snapshots}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card style={styles.historyCard}>
              <View style={styles.dateRow}>
                <Text style={styles.dateText}>{dateHelpers.formatDate(item.timestamp)}</Text>
                <Text style={styles.timeText}>{dateHelpers.formatTime(item.timestamp)}</Text>
              </View>
              
              <View style={styles.ratesRow}>
                <View style={styles.rateCol}>
                  <Text style={styles.rateLabel}>BCV</Text>
                  <Text style={styles.rateValue}>{currencyHelpers.formatRate(item.bcv, decimals)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.rateCol}>
                  <Text style={styles.rateLabel}>USDT</Text>
                  <Text style={styles.rateValue}>{currencyHelpers.formatRate(item.usdt, decimals)}</Text>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.m,
  },
  listContent: {
    paddingBottom: theme.spacing.xxl,
  },
  historyCard: {
    marginBottom: theme.spacing.m,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  dateText: {
    color: theme.colors.text,
    fontWeight: theme.typography.weights.semibold,
  },
  timeText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.s,
  },
  ratesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateCol: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: theme.colors.border,
  },
  rateLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.xs,
    marginBottom: 4,
  },
  rateValue: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.l,
    fontWeight: theme.typography.weights.bold,
  }
});
