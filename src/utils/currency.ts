export const currencyHelpers = {
  /**
   * Formatea un número como Bolívares (Bs.)
   */
  formatBs: (amount: number, decimals: number = 2): string => {
    return `Bs. ${amount.toLocaleString('es-VE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  },

  /**
   * Formatea un número como Dólares ($)
   */
  formatUSD: (amount: number, decimals: number = 2): string => {
    return `$ ${amount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  },

  /**
   * Formatea la tasa de cambio con 2 o 4 decimales según configuración
   */
  formatRate: (rate: number, decimals: number = 2): string => {
    return rate.toLocaleString('es-VE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
};
