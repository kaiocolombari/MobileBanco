import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Theme {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  accent: string;
  border: string;
  card: string;
  header: string;
  button: string;
  imageButtonCircle: string;
}

const lightTheme: Theme = {
  background: '#F5F9FF',
  surface: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  primary: '#1B98E0',
  accent: '#0686D0',
  border: '#E0E0E0',
  card: '#FFFFFF',
  header: '#1B98E0',
  button: '#0686D0',
  imageButtonCircle: '#E8F1F2',
};

const darkTheme: Theme = {
  background: '#141414',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  primary: '#1B98E0',
  accent: '#0686D0',
  border: '#333333',
  card: '#2A2A2A',
  header: '#1B98E0',
  button: '#0686D0',
  imageButtonCircle: '#404446',
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const theme = isDark ? darkTheme : lightTheme;

  // Load theme preference on startup
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem('themePreference', isDark ? 'dark' : 'light');
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    };

    if (!isLoading) {
      saveThemePreference();
    }
  }, [isDark, isLoading]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Show loading state while theme is being loaded
  if (isLoading) {
    return null; // Or you could return a loading component
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};