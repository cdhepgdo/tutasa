import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../constants/theme';

// Importar i18n para inicializar las traducciones desde el inicio
import '../i18n';

// Instancia global de React Query
const queryClient = new QueryClient();

import { LogBox } from 'react-native';
// Ignorar warnings ruidosos de compatibilidad web de la librería de gráficos (react-native-svg / chart-kit)
LogBox.ignoreLogs([
  'Unknown event handler property',
  'Invalid DOM property',
  'TouchableMixin is deprecated',
]);

// Sobrescribir temporalmente console.error para interceptar los errores de React DOM en la web
// antes de que el overlay rojo de Expo los atrape en la pantalla.
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && (
    args[0].includes('Unknown event handler property') ||
    args[0].includes('Invalid DOM property')
  )) {
    return; // Silenciar estos errores específicos
  }
  originalConsoleError(...args);
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" backgroundColor={theme.colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </QueryClientProvider>
  );
}
