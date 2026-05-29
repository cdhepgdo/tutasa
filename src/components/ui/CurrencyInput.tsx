import { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/theme';
import { validators } from '../../utils/validators';
// Importa los íconos (Expo ya los trae instalados)
import { Ionicons } from '@expo/vector-icons';
// Importa la herramienta del portapapeles
import * as Clipboard from 'expo-clipboard';

interface CurrencyInputProps extends Omit<TextInputProps, 'onChangeText'> {
  label?: string;
  currencySymbol?: string;
  value: string;
  onChangeText: (text: string) => void;
  isActive?: boolean; // Para mostrar borde de enfoque
  onFocus?: () => void;
}

export function CurrencyInput({
  label,
  currencySymbol = '$',
  value,
  onChangeText,
  isActive = false,
  onFocus,
  style,
  ...rest
}: CurrencyInputProps) {
  // 1. Creamos nuestro estado. Por defecto, no hemos copiado nada (false)
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (value) {
      // Esto guarda el valor actual en el portapapeles del celular
      await Clipboard.setStringAsync(value);

      // 2. Encendemos el estado "copiado"
      setIsCopied(true);

      // 3. Apagamos el estado "copiado" después de 2 segundos
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
  }

  const handleChange = (text: string) => {
    const sanitized = validators.sanitizeInput(text);
    onChangeText(sanitized);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {!!label && <Text style={styles.label}>{label}</Text>}
        {/* Botón de Copiar colocado arriba de forma sutil y limpia */}
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopy}
            disabled={isCopied}
          >
            <Ionicons
              name={isCopied ? "checkmark-circle" : "copy-outline"}
              size={14}
              color={isCopied ? "#4ade80" : theme.colors.primary}
            />
            <Text style={[styles.copyText, isCopied && { color: "#4ade80" }]}>
              {isCopied ? "Copiado" : "Copiar"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={[
        styles.inputContainer,
        isActive && styles.inputActive,
        style
      ]}>
        {!!currencySymbol && <Text style={styles.symbol}>{currencySymbol}</Text>}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          onFocus={onFocus}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={theme.colors.textMuted}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          maxLength={14}
          {...rest}
        />
        {/* Botón de Borrar (Solo lo mostramos si hay algún valor escrito y es mayor a 0) */}
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onChangeText('')} // Al presionar, enviamos un texto vacío
          >
            <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.s,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.s,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  copyText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceHighlight,
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: 12, // Reducido para dar más espacio a los números en cajas pequeñas
    height: 60,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  inputActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
  },
  symbol: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    marginRight: 6, // Reducido margen
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: theme.colors.text,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    height: '100%',
    // @ts-ignore - React Native Web property
    outlineStyle: 'none',
  },
  iconButton: {
    padding: 2, // Reducido para no quitar espacio al número
    marginLeft: 2, 
    justifyContent: 'center',
    alignItems: 'center',
  }
});
