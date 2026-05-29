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
  },

  /**
   * Detecta si estamos en el "Fin de Semana" (Viernes 3 PM hasta Lunes 12 PM)
   * donde el BCV no actualiza sus tasas.
   */
  isWeekendWindow: (): boolean => {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Lunes, 5 = Viernes, 6 = Sábado
    const hour = now.getHours();

    if (day === 5 && hour >= 15) return true; // Viernes después de las 3:00 PM
    if (day === 6 || day === 0) return true;  // Sábado y Domingo enteros
    if (day === 1 && hour < 12) return true;  // Lunes antes de las 12:00 PM
    
    return false;
  }
};
