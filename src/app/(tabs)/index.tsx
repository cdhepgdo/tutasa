import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeScreen } from '../../components/layout/SafeScreen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { CurrencyInput } from '../../components/ui/CurrencyInput';
import { OfflineBanner } from '../../components/ui/OfflineBanner';
import { theme } from '../../constants/theme';
import { useHistoryStore } from '../../features/history/historyStore';
import { useRates } from '../../features/rates/useRates';
import { useSettingsStore } from '../../features/settings/settingsStore';
import { calculations } from '../../utils/calculations';
import { currencyHelpers } from '../../utils/currency';
import { dateHelpers } from '../../utils/dateHelpers';

type CurrencyType = 'USD' | 'EUR' | 'USDT';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { rates, isLoading, isOfflineData, refetch, isFetching } = useRates();
  const { addSnapshot, snapshots } = useHistoryStore();
  const decimals = useSettingsStore(state => state.decimals);
  const useFutureRate = useSettingsStore(state => state.useFutureRate);
  const setUseFutureRate = useSettingsStore(state => state.setUseFutureRate);

  const isWeekend = dateHelpers.isWeekendWindow();

  // Auto-desactivar la tasa futura si ya pasó el fin de semana
  useEffect(() => {
    if (!isWeekend && useFutureRate) {
      setUseFutureRate(false);
    }
  }, [isWeekend, useFutureRate, setUseFutureRate]);

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>('USD');
  const [foreignAmount, setForeignAmount] = useState('');
  const [baseAmount, setBaseAmount] = useState('');
  const [lastEdited, setLastEdited] = useState<'foreign' | 'base'>('foreign');

  // Obtener la tasa correcta según la moneda seleccionada
  const getRateValue = (currency: CurrencyType) => {
    if (!rates) return 0;
    if (currency === 'USD') return rates.bcv;
    if (currency === 'EUR') return rates.eur;
    if (currency === 'USDT') return rates.usdt;
    return 0;
  };

  // Guardar historial al cargar (manteniendo lógica existente)
  useEffect(() => {
    if (rates && !isOfflineData) {
      addSnapshot({
        id: rates.lastUpdated.toString(),
        date: new Date().toISOString(),
        bcv: rates.bcv,
        eur: rates.eur,
        usdt: rates.usdt,
        timestamp: rates.lastUpdated,
      });
    }
  }, [rates, isOfflineData, addSnapshot]);

  // Recalcular conversor al cambiar moneda basado en el último input editado
  useEffect(() => {
    if (!rates) return;
    const rateValue = getRateValue(selectedCurrency);

    if (lastEdited === 'foreign') {
      const foreignVal = parseFloat(foreignAmount) || 0;
      if (foreignAmount) {
        setBaseAmount((foreignVal * rateValue).toFixed(decimals));
      }
    } else {
      const baseVal = parseFloat(baseAmount) || 0;
      if (baseAmount && rateValue) {
        setForeignAmount((baseVal / rateValue).toFixed(decimals));
      }
    }
  }, [selectedCurrency]);

  const handleForeignChange = (text: string) => {
    setLastEdited('foreign');
    setForeignAmount(text);
    if (!rates || !text) return setBaseAmount('');
    const val = parseFloat(text) || 0;
    const rateValue = getRateValue(selectedCurrency);
    setBaseAmount((val * rateValue).toFixed(decimals));
  };

  const handleBaseChange = (text: string) => {
    setLastEdited('base');
    setBaseAmount(text);
    if (!rates || !text) return setForeignAmount('');
    const val = parseFloat(text) || 0;
    const rateValue = getRateValue(selectedCurrency);
    if (rateValue) {
      setForeignAmount((val / rateValue).toFixed(decimals));
    }
  };

  // Obtener el snapshot previo para calcular la tendencia
  const previousSnapshot = snapshots[1];

  const renderTrend = (current: number, previous?: number) => {
    const trend = calculations.calculateTrend(current, previous);
    if (trend.isNeutral) return null;

    return (
      <View style={styles.trendContainer}>
        <Ionicons
          name={trend.isUp ? 'arrow-up' : 'arrow-down'}
          size={14}
          color={trend.isUp ? theme.colors.success : theme.colors.error}
        />
        <Text style={[styles.trendText, { color: trend.isUp ? theme.colors.success : theme.colors.error }]}>
          {trend.percent.toFixed(1)}%
        </Text>
      </View>
    );
  };

  const renderRateCard = (type: CurrencyType, symbol: string, value?: number, prevValue?: number) => {
    const isSelected = selectedCurrency === type;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedCurrency(type)}
        style={[styles.rateCard, isSelected && styles.rateCardSelected]}
      >
        <View style={styles.rateCardLeft}>
          <Text style={[styles.rateSymbol, isSelected && styles.textSelected]}>{symbol}</Text>
          <Text style={[styles.rateValue, isSelected && styles.textSelected]}>
            Bs. {value ? currencyHelpers.formatBs(value, decimals).replace('Bs. ', '') : '---'}
          </Text>
        </View>
        <View style={styles.rateCardRight}>
          {renderTrend(value || 0, prevValue)}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.headerRow}>
          <ScreenHeader
            title="Tu Tasa"
            subtitle={rates ? t('home.lastUpdated', { time: dateHelpers.formatTime(rates.lastUpdated) }) : undefined}
          />
          <TouchableOpacity onPress={() => refetch()} style={styles.refreshBtn}>
            <Ionicons name="refresh" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <OfflineBanner isOffline={isOfflineData} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={theme.colors.primary} />
          }
        >
          {isLoading && !rates ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : rates ? (
            <>
              {/* Tarjetas de Tasas (Estilo apilado del boceto) */}
              <View style={styles.ratesList}>
                {renderRateCard('USD', '$', rates.bcv, previousSnapshot?.bcv)}
                {renderRateCard('EUR', '€', rates.eur, previousSnapshot?.eur)}
                {renderRateCard('USDT', '₮', rates.usdt, previousSnapshot?.usdt)}
              </View>

              {/* Toggle de Tasa Futura (Próxima Actualización) - Solo visible en Fin de Semana */}
              {isWeekend && (
                <View style={styles.toggleContainer}>
                  <View style={styles.toggleTextContainer}>
                    <Text style={styles.toggleTitle}>Sugerencia de Fin de Semana</Text>
                    <Text style={[styles.toggleSubtitle, useFutureRate && styles.toggleSubtitleActive]}>
                      {useFutureRate
                        ? `Tasa del Lunes`
                        : `Usando BCV de Cierre`}
                    </Text>
                  </View>
                  <Switch
                    value={useFutureRate}
                    onValueChange={setUseFutureRate}
                    trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                    thumbColor={Platform.OS === 'ios' ? '#fff' : useFutureRate ? '#fff' : theme.colors.textMuted}
                    ios_backgroundColor={theme.colors.border}
                  />
                </View>
              )}

              {/* Mini Conversor Integrado */}
              <Card style={styles.converterCard}>
                <Text style={styles.converterTitle}>Calculadora Rápida</Text>

                <CurrencyInput
                  label={`Monto en ${selectedCurrency}`}
                  currencySymbol={selectedCurrency === 'USD' ? '$' : selectedCurrency === 'EUR' ? '€' : '₮'}
                  value={foreignAmount}
                  onChangeText={handleForeignChange}
                  onFocus={() => setLastEdited('foreign')}
                  isActive={lastEdited === 'foreign'}
                  placeholder="0.00"
                />

                <CurrencyInput
                  label="Bolívares (Bs)"
                  currencySymbol="Bs."
                  value={baseAmount}
                  onChangeText={handleBaseChange}
                  onFocus={() => setLastEdited('base')}
                  isActive={lastEdited === 'base'}
                  placeholder="0.00"
                />
              </Card>
            </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingRight: theme.spacing.l,
  },
  refreshBtn: {
    padding: theme.spacing.s,
    marginTop: theme.spacing.m,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.l,
  },
  loadingContainer: {
    padding: theme.spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratesList: {
    gap: theme.spacing.m,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  rateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rateCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceHighlight,
  },
  rateCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
  },
  rateSymbol: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textMuted,
    width: 30,
  },
  rateValue: {
    fontSize: theme.typography.sizes.l,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
  },
  textSelected: {
    color: theme.colors.primary,
  },
  rateCardRight: {
    alignItems: 'flex-end',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    fontSize: theme.typography.sizes.s,
    fontWeight: theme.typography.weights.medium,
  },
  converterCard: {
    padding: theme.spacing.l,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.l,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: theme.spacing.m,
  },
  toggleTitle: {
    fontSize: theme.typography.sizes.m,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: theme.typography.sizes.s,
    color: theme.colors.textMuted,
  },
  toggleSubtitleActive: {
    color: '#f97316', // un naranja premium como en el boceto del usuario
    fontWeight: theme.typography.weights.medium,
  },
  converterTitle: {
    fontSize: theme.typography.sizes.m,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  }
});
