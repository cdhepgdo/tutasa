import React from 'react';
import { StyleSheet, ViewProps, SafeAreaView, StatusBar, View } from 'react-native';
import { theme } from '../../constants/theme';

export function SafeScreen({ children, style, ...rest }: ViewProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <View style={[styles.container, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
  }
});
