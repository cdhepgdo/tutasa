import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Wrapper de almacenamiento.
 * Usamos AsyncStorage en Fase 1 (Expo Managed).
 * Preparado para reemplazar por react-native-mmkv en Fase 2 (Expo Bare).
 */
export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error(`Error saving storage key ${key}:`, e);
    }
  },
  
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.error(`Error reading storage key ${key}:`, e);
      return null;
    }
  },
  
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing storage key ${key}:`, e);
    }
  },
  
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
  }
};
