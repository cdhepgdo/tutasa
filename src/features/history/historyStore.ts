import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryState } from './types';

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      snapshots: [],
      
      addSnapshot: (snapshot) => set((state) => {
        // Evitar duplicados del mismo día (basado en el id YYYY-MM-DD)
        const exists = state.snapshots.some(s => s.id === snapshot.id);
        if (exists) {
          // Si ya existe, podríamos actualizarlo o ignorarlo.
          // Para un "snapshot diario", lo ideal es actualizarlo si la tasa cambió significativamente,
          // o simplemente mantener el primero del día. Vamos a mantener el último del día.
          const filtered = state.snapshots.filter(s => s.id !== snapshot.id);
          return { snapshots: [snapshot, ...filtered].sort((a, b) => b.timestamp - a.timestamp) };
        }
        
        // Agregar al inicio y mantener un máximo de 90 días
        const newSnapshots = [snapshot, ...state.snapshots].slice(0, 90);
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
