export type ThemeMode = 'light' | 'dark' | 'system';
export type AppLanguage = 'es' | 'en' | 'pt' | 'ar' | 'zh' | 'it';

export interface SettingsState {
  theme: ThemeMode;
  language: AppLanguage;
  decimals: number;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (lang: AppLanguage) => void;
  setDecimals: (decimals: number) => void;
}
