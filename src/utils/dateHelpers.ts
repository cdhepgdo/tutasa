export const dateHelpers = {
  /**
   * Genera el ID único para los snapshots diarios (formato YYYY-MM-DD)
   */
  getTodayId: (): string => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  },

  /**
   * Formatea un timestamp para mostrar la hora de actualización
   * Ej: "14:30" o "2:30 PM"
   */
  formatTime: (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('es-VE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  },
  
  /**
   * Formatea una fecha completa para el historial
   * Ej: "21/05/2026"
   */
  formatDate: (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('es-VE');
  }
};
