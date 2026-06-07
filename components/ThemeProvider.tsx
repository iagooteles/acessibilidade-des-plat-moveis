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
  campo: string;
  titulo: string;
};

const light: Theme = {
  background: '#ffffff',
  text: '#111111',
  muted: '#6b7280',
  primary: '#5db075',
  headerText: '#ffffff',
  card: '#f7f7f7',
  textOnPrimary: '#ffffff',
  campo: '#6b7280',
  titulo:'#111111'
};

const dark: Theme = {
  background: '#0b1220',
  text: '#e6eef6',
  muted: '#9aa6b2',
  primary: '#4ade80',
  headerText: '#ffffff',
  card: '#101827',
  textOnPrimary: '#ffffff',
  campo: '#4ade80',
  titulo:'#9aa6b2'
};

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => Promise<void>;
  isDark: boolean;
  highContrast: boolean;
  toggleHighContrast: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const rawDark = await AsyncStorage.getItem('@app:theme_dark');
        const rawContrast = await AsyncStorage.getItem('@app:high_contrast');
        const loadedContrast = rawContrast === '1';
        const loadedDark = rawDark === '1' && !loadedContrast;

        setHighContrast(loadedContrast);
        setIsDark(loadedDark);
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

      if (next && highContrast) {
        setHighContrast(false);
        await AsyncStorage.setItem('@app:high_contrast', '0');
      }
    } catch (e) {
      // ignore
    }
  };

  const toggleHighContrast = async () => {
    try {
      const next = !highContrast;
      setHighContrast(next);
      await AsyncStorage.setItem('@app:high_contrast', next ? '1' : '0');

      if (next && isDark) {
        setIsDark(false);
        await AsyncStorage.setItem('@app:theme_dark', '0');
      }
    } catch (e) {
      // ignore
    }
  };

  const effectiveTheme = (() => {
    if (highContrast) {
      return {
        background: '#000000',
        text: '#FFFF00',
        muted: '#FFFF00',
        primary: '#FFFF00',
        headerText: '#FFFF00',
        card: '#000000',
        textOnPrimary: '#000000',
        campo: '#FFFF00',
        titulo: '#ffffff',
      };
    }

    return isDark ? dark : light;
  })();

  const value: ThemeContextValue = {
    theme: effectiveTheme,
    toggleTheme,
    isDark,
    highContrast,
    toggleHighContrast,
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
