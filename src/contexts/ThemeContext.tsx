'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ISettingsStorage, Theme, Contrast } from '@/domain/settings';
import { defaultSettingsStorage } from '@/infrastructure/storage';

interface ThemeContextType {
    theme: Theme;
    contrast: Contrast;
    setTheme: (theme: Theme) => void;
    setContrast: (contrast: Contrast) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    storage?: ISettingsStorage;
}

/**
 * Theme Provider
 *
 * Manages theme and contrast settings with optional storage injection.
 * Defaults to localStorage adapter.
 */
export function ThemeProvider({ children, storage = defaultSettingsStorage }: ThemeProviderProps) {
    // Lazy initialize from storage (only runs on client)
    const [theme, setThemeState] = useState<Theme>(() => {
        const saved = storage.getTheme();
        if (saved) return saved;
        if (typeof window === 'undefined') return 'light';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    });

    const [contrast, setContrastState] = useState<Contrast>(() => {
        return storage.getContrast() || 'default';
    });

    // Apply theme to document
    const applyTheme = (newTheme: Theme, newContrast: Contrast) => {
        document.documentElement.setAttribute('data-theme', newTheme);
        if (newContrast === 'default') {
            document.documentElement.removeAttribute('data-contrast');
        } else {
            document.documentElement.setAttribute('data-contrast', newContrast);
        }
    };

    // Apply theme on mount and when values change
    useEffect(() => {
        applyTheme(theme, contrast);
    }, [theme, contrast]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        storage.setTheme(newTheme);
        applyTheme(newTheme, contrast);
    };

    const setContrast = (newContrast: Contrast) => {
        setContrastState(newContrast);
        storage.setContrast(newContrast);
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

// Re-export types for consumers
export type { Theme, Contrast } from '@/domain/settings';
