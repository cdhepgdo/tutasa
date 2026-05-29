import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryState } from './types';

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      snapshots: [],
      
      addSnapshot: (snapshot) => set((state) => {
        // 1. Obtener el último snapshot guardado en el historial
        const lastSnapshot = state.snapshots[0];
        
        // 2. Si ya tenemos un registro y tiene exactamente los mismos valores, lo ignoramos para evitar spam
        if (
          lastSnapshot &&
          lastSnapshot.bcv === snapshot.bcv &&
          lastSnapshot.eur === snapshot.eur &&
          lastSnapshot.usdt === snapshot.usdt
        ) {
          return {}; // No hacemos cambios
        }
        
        // 3. Filtrar cualquier duplicado por ID que pudiera existir (por errores pasados)
        const cleanSnapshots = state.snapshots.filter(s => s.id !== snapshot.id);
        
        // 4. Si las tasas cambiaron, agregamos el nuevo registro al inicio y limitamos a 100 elementos
        const newSnapshots = [snapshot, ...cleanSnapshots].slice(0, 100);
        return { snapshots: newSnapshots };
      }),
      
      clearHistory: () => set({ snapshots: [] }),
      
      getSnapshotByDate: (id) => get().snapshots.find(s => s.id === id),
    }),
    {
      name: 'tutasa-history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
