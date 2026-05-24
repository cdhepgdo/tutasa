import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeScreen } from '../../components/layout/SafeScreen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Divider } from '../../components/ui/Divider';
import { useSettingsStore } from '../../features/settings/settingsStore';
import { AppLanguage } from '../../features/settings/types';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import { AdBanner } from '../../features/ads/AdBanner';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { language, decimals, setLanguage, setDecimals } = useSettingsStore();

  const handleLanguageChange = (lang: AppLanguage) => {
    setLanguage(lang);
  };

  const handleDecimalsChange = (num: number) => {
    setDecimals(num);
  };

  return (
    <SafeScreen>
      <ScreenHeader title={t('settings.title')} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AdBanner />

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <View style={styles.buttonGroup}>
            <Button 
              title="ES" 
              variant={language === 'es' ? 'primary' : 'secondary'} 
              onPress={() => handleLanguageChange('es')}
              style={styles.flexBtn}
            />
            <Button 
              title="EN" 
              variant={language === 'en' ? 'primary' : 'secondary'} 
              onPress={() => handleLanguageChange('en')}
              style={styles.flexBtn}
            />
            {/* Se pueden añadir los demás idiomas aquí a medida que se traduzcan */}
          </View>
          
          <Divider />
          
          <Text style={styles.sectionTitle}>{t('settings.decimals')}</Text>
          <View style={styles.buttonGroup}>
            <Button 
              title="2 Dec." 
              variant={decimals === 2 ? 'primary' : 'secondary'} 
              onPress={() => handleDecimalsChange(2)}
              style={styles.flexBtn}
            />
            <Button 
              title="4 Dec." 
              variant={decimals === 4 ? 'primary' : 'secondary'} 
              onPress={() => handleDecimalsChange(4)}
              style={styles.flexBtn}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
          <Text style={styles.infoText}>TuTasa v1.0.0</Text>
          <Text style={styles.infoText}>Tasas proveídas por DolarAPI.com</Text>
        </Card>

      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  card: {
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.s,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.m,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: theme.spacing.s,
  },
  flexBtn: {
    flex: 1,
  },
  infoText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.m,
    marginBottom: theme.spacing.xs,
  }
});
