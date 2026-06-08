import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = {
  background: string;
  text: string;
  muted: string;
  primary: string;
  headerText: string;
  card: string;
  textOnPrimary: string;
};

const light: Theme = {
  background: '#ffffff',
  text: '#111111',
  muted: '#6b7280',
  primary: '#5db075',
  headerText: '#ffffff',
  card: '#f7f7f7',
  textOnPrimary: '#ffffff',
};

const dark: Theme = {
  background: '#0b1220',
  text: '#e6eef6',
  muted: '#9aa6b2',
  primary: '#4ade80',
  headerText: '#ffffff',
  card: '#101827',
  textOnPrimary: '#ffffff',
};

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => Promise<void>;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@app:theme_dark');
        if (raw === '1') setIsDark(true);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const toggleTheme = async () => {
    try {
      const next = !isDark;
      setIsDark(next);
      await AsyncStorage.setItem('@app:theme_dark', next ? '1' : '0');
    } catch (e) {
      // ignore
    }
  };

  const value: ThemeContextValue = {
    theme: isDark ? dark : light,
    toggleTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default ThemeProvider;
