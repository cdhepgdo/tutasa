import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsState } from './types';
import { config } from '../../constants/config';
import i18n from '../../i18n';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark', // Por defecto oscuro, a petición
      language: 'es',
      decimals: config.DEFAULT_DECIMALS,
      
      setTheme: (theme) => set({ theme }),
      
      setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({ language });
      },
      
      setDecimals: (decimals) => set({ decimals }),
    }),
    {
      name: 'tutasa-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Al recargar el estado persistido, asegurarnos de que i18next
        // use el idioma guardado.
        if (state?.language) {
          i18n.changeLanguage(state.language);
        }
      },
    }
  )
);
