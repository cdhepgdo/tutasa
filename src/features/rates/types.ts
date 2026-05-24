export interface RateData {
  bcv: number;
  eur: number;
  usdt: number;
  lastUpdated: number; // Timestamp en milisegundos
}

export interface RatesState {
  currentRates: RateData | null;
  isLoading: boolean;
  error: string | null;
  setRates: (rates: RateData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
