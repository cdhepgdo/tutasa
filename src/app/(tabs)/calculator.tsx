import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeScreen } from '../../components/layout/SafeScreen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { CurrencyInput } from '../../components/ui/CurrencyInput';
import { Divider } from '../../components/ui/Divider';
import { ResultBadge } from '../../components/ui/ResultBadge';
import { theme } from '../../constants/theme';
import { useRates } from '../../features/rates/useRates';
import { useSettingsStore } from '../../features/settings/settingsStore';
import { calculations } from '../../utils/calculations';
import { currencyHelpers } from '../../utils/currency';

type RateSource = 'bcv' | 'eur' | 'usdt' | 'custom';

export default function CalculatorScreen() {
  const { t } = useTranslation();
  const decimals = useSettingsStore(state => state.decimals);
  const { rates, isFetching, refetch } = useRates();

  // Estado: Tasa Seleccionada
  const [activeRateSource, setActiveRateSource] = useState<RateSource>('bcv');
  const [customRateVal, setCustomRateVal] = useState('');

  // Estado: Precio con Ganancia
  const [basePrice, setBasePrice] = useState('');
  const [profitMargin, setProfitMargin] = useState('30');

  // Estado: Descuentos
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('5');

  // Estado: Divisor de Cuentas
  const [billTotal, setBillTotal] = useState('');
  const [peopleCount, setPeopleCount] = useState('2');
  const [tipPercent, setTipPercent] = useState('10');

  // Determinar la Tasa Activa a usar en toda la pantalla
  let activeRate = 0;
  if (activeRateSource === 'custom') {
    activeRate = parseFloat(customRateVal) || 0;
  } else if (rates) {
    activeRate = rates[activeRateSource] || rates.bcv;
  }

  // Cálculos Reactivos: Ganancia
  const parsedBase = parseFloat(basePrice) || 0;
  const parsedMargin = parseFloat(profitMargin) || 0;
  const finalProfitPrice = calculations.calculateProfit(parsedBase, parsedMargin);
  const finalProfitPriceBs = activeRate ? calculations.usdToBs(finalProfitPrice, activeRate) : 0;

  // Cálculos Reactivos: Descuento
  const parsedOriginal = parseFloat(originalPrice) || 0;
  const parsedDiscount = parseFloat(discountPercent) || 0;
  const discountAmount = parsedOriginal * (parsedDiscount / 100);
  const discountedPrice = parsedOriginal - discountAmount;
  const discountedPriceBs = activeRate ? calculations.usdToBs(discountedPrice, activeRate) : 0;

  // Cálculos Reactivos: Divisor de Cuentas
  const parsedBill = parseFloat(billTotal) || 0;
  const parsedPeople = parseInt(peopleCount, 10) || 1;
  const parsedTip = parseFloat(tipPercent) || 0;
  const billWithTip = parsedBill + (parsedBill * (parsedTip / 100));
  const perPersonUsd = parsedPeople > 0 ? billWithTip / parsedPeople : 0;
  const perPersonBs = activeRate ? calculations.usdToBs(perPersonUsd, activeRate) : 0;

  const renderRefreshButton = () => (
    <TouchableOpacity onPress={() => refetch()} style={styles.refreshBtn} disabled={isFetching}>
      {isFetching ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <Ionicons name="refresh" size={24} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
      >
        <ScreenHeader title={t('calculator.title')} rightElement={renderRefreshButton()} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* SECCIÓN 1: Selector de Tasa Global */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Tasa a Usar en Cálculos</Text>
            <View style={styles.chipRow}>
              {(['bcv', 'eur', 'usdt', 'custom'] as RateSource[]).map(source => (
                <TouchableOpacity
                  key={source}
                  style={[styles.chip, activeRateSource === source && styles.chipActive]}
                  onPress={() => setActiveRateSource(source)}
                >
                  <Text style={[styles.chipText, activeRateSource === source && styles.chipTextActive]}>
                    {source === 'custom' ? 'Personal' : source.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {activeRateSource === 'custom' && (
              <View style={{ marginTop: theme.spacing.m }}>
                <CurrencyInput
                  label="Tasa Personalizada (Bs)"
                  currencySymbol="Bs."
                  value={customRateVal}
                  onChangeText={setCustomRateVal}
                  placeholder="0.00"
                />
              </View>
            )}

            {activeRateSource !== 'custom' && rates && (
              <Text style={styles.activeRateText}>
                Valor Activo: {currencyHelpers.formatBs(rates[activeRateSource] || rates.bcv, decimals)}
              </Text>
            )}
          </Card>

          {/* SECCIÓN 2: Calculadora de Descuentos */}
          <Card style={styles.card}>
            <ScreenHeader title="Pago con Descuento (Divisas)" />
            <View style={styles.row}>
              <View style={styles.inputFlex2}>
                <CurrencyInput
                  label="Monto Total"
                  value={originalPrice}
                  onChangeText={setOriginalPrice}
                  placeholder="0.00"
                />
              </View>
              <View style={styles.inputFlex1}>
                <CurrencyInput
                  label="Desc. (%)"
                  currencySymbol=""
                  value={discountPercent}
                  onChangeText={setDiscountPercent}
                  placeholder="5"
                />
              </View>
            </View>

            <Divider />

            <ResultBadge
              label="A Pagar (USD)"
              value={currencyHelpers.formatUSD(discountedPrice, decimals)}
            />
            <ResultBadge
              label="A Pagar (Bs)"
              value={currencyHelpers.formatBs(discountedPriceBs, decimals)}
            />
            <Text style={styles.savingsText}>Ahorras: {currencyHelpers.formatUSD(discountAmount, decimals)}</Text>
          </Card>

          {/* SECCIÓN 3: Precio con Ganancia */}
          <Card style={styles.card}>
            <ScreenHeader title={t('calculator.profit')} />
            <View style={styles.row}>
              <View style={styles.inputFlex2}>
                <CurrencyInput
                  label={t('calculator.basePrice')}
                  value={basePrice}
                  onChangeText={setBasePrice}
                  placeholder="0.00"
                />
              </View>
              <View style={styles.inputFlex1}>
                <CurrencyInput
                  label={t('calculator.profitMargin')}
                  currencySymbol=""
                  value={profitMargin}
                  onChangeText={setProfitMargin}
                  placeholder="30"
                />
              </View>
            </View>

            <Divider />

            <ResultBadge
              label={t('calculator.finalPrice') + ' (USD)'}
              value={currencyHelpers.formatUSD(finalProfitPrice, decimals)}
            />
            <ResultBadge
              label={t('calculator.finalPrice') + ' (Bs)'}
              value={currencyHelpers.formatBs(finalProfitPriceBs, decimals)}
            />
          </Card>

          {/* SECCIÓN 4: Divisor de Cuentas */}
          <Card style={styles.card}>
            <ScreenHeader title="Dividir Cuenta (Restaurantes)" />
            <View style={styles.row}>
              <View style={styles.inputFlex2}>
                <CurrencyInput
                  label="Total Consumido"
                  value={billTotal}
                  onChangeText={setBillTotal}
                  placeholder="0.00"
                />
              </View>
              <View style={styles.inputFlex1}>
                <CurrencyInput
                  label="Propina (%)"
                  currencySymbol=""
                  value={tipPercent}
                  onChangeText={setTipPercent}
                  placeholder="10"
                />
              </View>
            </View>

            <View style={{ marginTop: theme.spacing.m }}>
              <CurrencyInput
                label="Número de Personas"
                currencySymbol="👤"
                value={peopleCount}
                onChangeText={setPeopleCount}
                placeholder="2"
              />
            </View>

            <Divider />

            <ResultBadge
              label="Por Persona (USD)"
              value={currencyHelpers.formatUSD(perPersonUsd, decimals)}
            />
            <ResultBadge
              label="Por Persona (Bs)"
              value={currencyHelpers.formatBs(perPersonBs, decimals)}
            />
          </Card>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 250, // Gran relleno para asegurar que el teclado nunca tape las tarjetas inferiores en Android
  },
  card: {
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.l,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing.m,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.m,
  },
  inputFlex2: {
    flex: 2,
  },
  inputFlex1: {
    flex: 1,
  },
  refreshBtn: {
    padding: theme.spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  chip: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.s,
    fontWeight: theme.typography.weights.medium,
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: theme.typography.weights.bold,
  },
  activeRateText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.m,
    fontWeight: theme.typography.weights.bold,
    marginTop: theme.spacing.m,
    textAlign: 'center',
  },
  savingsText: {
    color: theme.colors.success,
    fontSize: theme.typography.sizes.s,
    textAlign: 'center',
    marginTop: theme.spacing.s,
    fontWeight: theme.typography.weights.medium,
  }
});
