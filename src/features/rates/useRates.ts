import { useQuery } from '@tanstack/react-query';
import { ratesService } from './ratesService';
import { useRatesStore } from './ratesStore';
import { useSettingsStore } from '../settings/settingsStore';
import { config } from '../../constants/config';
import { useEffect } from 'react';

export function useRates() {
  const setRates = useRatesStore((state) => state.setRates);
  const currentRates = useRatesStore((state) => state.currentRates);
  const useFutureRate = useSettingsStore((state) => state.useFutureRate);

  const query = useQuery({
    queryKey: ['rates', useFutureRate],
    queryFn: async () => {
      const data = await ratesService.getRates(useFutureRate);
      return data;
    },
    // Refetch cada X minutos
    refetchInterval: config.CACHE_MINUTES * 60 * 1000,
    // La data se considera fresca durante este tiempo
    staleTime: config.CACHE_MINUTES * 60 * 1000,
  });

  // Sincronizar exitosamente con Zustand (para persistencia y acceso global sin hooks si se requiere)
  useEffect(() => {
    if (query.data) {
      setRates(query.data);
    }
  }, [query.data, setRates]);

  return {
    rates: query.data || currentRates, // Si no hay internet, muestra los cacheados
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    // Determinar si estamos mostrando datos cacheados estando offline
    isOfflineData: query.isError && !!currentRates,
  };
}
