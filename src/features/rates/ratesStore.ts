import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RatesState } from './types';

export const useRatesStore = create<RatesState>()(
  persist(
    (set) => ({
      currentRates: null,
      isLoading: false,
      error: null,
      
      setRates: (rates) => set({ currentRates: rates, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'tutasa-rates-storage', // key en el storage
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistimos currentRates, no los estados de carga o error
      partialize: (state) => ({ currentRates: state.currentRates }),
    }
  )
);
