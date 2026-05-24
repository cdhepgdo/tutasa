import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.s,
    marginTop: 4,
  }
});
