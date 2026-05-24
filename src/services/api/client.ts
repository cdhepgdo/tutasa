import axios from 'axios';
import { config } from '../../constants/config';

// Instancia base para DolarAPI y Open.er-api
export const apiClient = axios.create({
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Instancia específica para Binance P2P (requiere headers distintos)
export const binanceClient = axios.create({
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

// Interceptor global para manejo de errores común
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí podríamos agregar logging (Crashlytics, etc.) en el futuro
    console.warn('API Error:', error.message || error);
    return Promise.reject(error);
  }
);
