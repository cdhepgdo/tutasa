export const validators = {
  /**
   * Limpia un string numérico, permitiendo solo un punto decimal
   * y reemplazando comas por puntos. Útil para TextInput de React Native.
   */
  sanitizeInput: (text: string): string => {
    // Reemplazar coma por punto
    let sanitized = text.replace(',', '.');
    
    // Remover caracteres no numéricos excepto el punto
    sanitized = sanitized.replace(/[^0-9.]/g, '');
    
    // Evitar múltiples puntos
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }
    
    return sanitized;
  },

  /**
   * Valida si un string puede ser parseado a un monto numérico válido mayor a 0
   */
  isValidAmount: (text: string): boolean => {
    const num = parseFloat(text);
    return !isNaN(num) && num > 0;
  }
};
