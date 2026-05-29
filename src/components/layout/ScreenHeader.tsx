import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, rightElement }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightElement && (
        <View style={styles.rightContainer}>
          {rightElement}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  textContainer: {
    flex: 1,
  },
  rightContainer: {
    marginLeft: theme.spacing.m,
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
