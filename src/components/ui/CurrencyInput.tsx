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
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        isActive && styles.inputActive,
        style
      ]}>
        <Text style={styles.symbol}>{currencySymbol}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          onFocus={onFocus}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={theme.colors.textMuted}
          {...rest}
        />
        {/* Botón de Borrar (Solo lo mostramos si hay algún valor escrito y es mayor a 0) */}
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onChangeText('')} // Al presionar, enviamos un texto vacío
          >
            <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
        {/* Botón de Copiar */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleCopy}
          disabled={isCopied} // Opcional: Desactiva el botón mientras dure el check para evitar doble copia
        >
          <Ionicons
            // Si isCopied es true, mostramos un check, si no, mostramos los papelitos
            name={isCopied ? "checkmark-circle" : "copy-outline"}
            size={20}
            // Si tienes un color de éxito en tu theme (como theme.colors.success) puedes usarlo aquí.
            // Si no, podemos usar un verde estándar o mantener el primario.
            color={isCopied ? "#4ade80" : theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.s,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.s,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceHighlight,
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
    height: 60,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
  },
  symbol: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    marginRight: theme.spacing.s,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    height: '100%',
    // @ts-ignore - React Native Web property
    outlineStyle: 'none',
  },
  iconButton: {
    padding: theme.spacing.s,
    marginLeft: theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
