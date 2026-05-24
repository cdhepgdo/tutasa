/**
 * Funciones puras para lógica matemática financiera de la app.
 * Sin dependencias externas de React para poder ser testeadas fácilmente.
 */

export const calculations = {
  // Convertir dólares a bolívares
  usdToBs: (usd: number, rate: number): number => {
    return usd * rate;
  },

  // Convertir bolívares a dólares
  bsToUsd: (bs: number, rate: number): number => {
    if (rate === 0) return 0;
    return bs / rate;
  },

  // Calcular precio final sumando un porcentaje de ganancia
  calculateProfit: (baseAmount: number, marginPercent: number): number => {
    return baseAmount * (1 + marginPercent / 100);
  },

  // Calcular precio final restando un porcentaje de descuento
  calculateDiscount: (baseAmount: number, discountPercent: number): number => {
    return baseAmount * (1 - discountPercent / 100);
  },

  // Calcular el cambio/vuelto a entregar
  calculateChange: (paidAmount: number, totalAmount: number): number => {
    return Math.max(0, paidAmount - totalAmount);
  },

  // Calcular porcentaje de tendencia (+ o -) entre dos tasas
  calculateTrend: (currentRate: number, previousRate?: number): { percent: number, isUp: boolean, isNeutral: boolean } => {
    if (!previousRate || previousRate === 0) {
      return { percent: 0, isUp: true, isNeutral: true };
    }
    const diff = currentRate - previousRate;
    const percent = (Math.abs(diff) / previousRate) * 100;
    
    // Si la diferencia es menor a 0.01%, consideramos que es neutro
    if (percent < 0.01) {
      return { percent: 0, isUp: true, isNeutral: true };
    }

    return {
      percent: percent,
      isUp: diff > 0,
      isNeutral: false
    };
  }
};
