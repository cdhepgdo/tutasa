import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeScreen } from '../../components/layout/SafeScreen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { CurrencyInput } from '../../components/ui/CurrencyInput';
import { ResultBadge } from '../../components/ui/ResultBadge';
import { Card } from '../../components/ui/Card';
import { Divider } from '../../components/ui/Divider';
import { calculations } from '../../utils/calculations';
import { currencyHelpers } from '../../utils/currency';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import { useSettingsStore } from '../../features/settings/settingsStore';
import { useRates } from '../../features/rates/useRates';

export default function CalculatorScreen() {
  const { t } = useTranslation();
  const decimals = useSettingsStore(state => state.decimals);
  const { rates } = useRates();
  
  // States para Precio con Ganancia
  const [basePrice, setBasePrice] = useState('');
  const [profitMargin, setProfitMargin] = useState('30');
  
  // States para Cambio Exacto
  const [totalToPay, setTotalToPay] = useState('');
  const [amountPaid, setAmountPaid] = useState('');

  // Cálculos reactivos
  const parsedBase = parseFloat(basePrice) || 0;
  const parsedMargin = parseFloat(profitMargin) || 0;
  const finalProfitPrice = calculations.calculateProfit(parsedBase, parsedMargin);
  const finalProfitPriceBs = rates ? calculations.usdToBs(finalProfitPrice, rates.bcv) : 0;

  const parsedTotal = parseFloat(totalToPay) || 0;
  const parsedPaid = parseFloat(amountPaid) || 0;
  const changeAmount = calculations.calculateChange(parsedPaid, parsedTotal);

  return (
    <SafeScreen>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenHeader title={t('calculator.title')} />
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Sección: Precio con Ganancia */}
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
                currencySymbol="%"
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
          {rates && (
            <ResultBadge
              label={t('calculator.finalPrice') + ' (Bs)'}
              value={currencyHelpers.formatBs(finalProfitPriceBs, decimals)}
            />
          )}
        </Card>

        {/* Sección: Cambio Exacto */}
        <Card style={styles.card}>
          <ScreenHeader title={t('calculator.change')} />
          <CurrencyInput
            label={t('calculator.totalToPay')}
            currencySymbol="Bs."
            value={totalToPay}
            onChangeText={setTotalToPay}
            placeholder="0.00"
          />
          <CurrencyInput
            label={t('calculator.amountPaid')}
            currencySymbol="Bs."
            value={amountPaid}
            onChangeText={setAmountPaid}
            placeholder="0.00"
          />
          
          <Divider />
          
          <ResultBadge
            label={t('calculator.yourChange') + ' (Bs)'}
            value={currencyHelpers.formatBs(changeAmount, decimals)}
          />
          {rates && (
            <ResultBadge
              label={t('calculator.yourChange') + ' (USD)'}
              value={currencyHelpers.formatUSD(calculations.bsToUsd(changeAmount, rates.bcv), decimals)}
            />
          )}
        </Card>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  card: {
    marginBottom: theme.spacing.l,
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
  }
});
