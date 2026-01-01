'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark';
export type Contrast = 'default' | 'medium' | 'high';

interface ThemeContextType {
    theme: Theme;
    contrast: Contrast;
    setTheme: (theme: Theme) => void;
    setContrast: (contrast: Contrast) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light');
    const [contrast, setContrastState] = useState<Contrast>('default');
    const [isMounted, setIsMounted] = useState(false);

    // Apply theme to document
    const applyTheme = (newTheme: Theme, newContrast: Contrast) => {
        document.documentElement.setAttribute('data-theme', newTheme);
        if (newContrast === 'default') {
            document.documentElement.removeAttribute('data-contrast');
        } else {
            document.documentElement.setAttribute('data-contrast', newContrast);
        }
    };

    // Load saved preferences
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        const savedContrast = localStorage.getItem('contrast') as Contrast | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        const initialContrast = savedContrast || 'default';

        setThemeState(initialTheme);
        setContrastState(initialContrast);
        applyTheme(initialTheme, initialContrast);
        setIsMounted(true);
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme, contrast);
    };

    const setContrast = (newContrast: Contrast) => {
        setContrastState(newContrast);
        localStorage.setItem('contrast', newContrast);
        applyTheme(theme, newContrast);
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };



    return (
        <ThemeContext.Provider value={{ theme, contrast, setTheme, setContrast, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
