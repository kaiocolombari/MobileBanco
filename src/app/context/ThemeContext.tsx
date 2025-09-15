import React, { createContext, useContext, useState, ReactNode } from 'react';

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

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

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