export interface RateSnapshot {
  id: string; // "YYYY-MM-DD"
  date: string; // ISO String
  bcv: number;
  eur: number;
  usdt: number;
  timestamp: number;
}

export interface HistoryState {
  snapshots: RateSnapshot[];
  addSnapshot: (snapshot: RateSnapshot) => void;
  clearHistory: () => void;
  getSnapshotByDate: (id: string) => RateSnapshot | undefined;
}
