import { ISettingsStorage, Theme, Contrast } from '@/domain/settings';

/**
 * LocalStorage Settings Adapter
 *
 * Implements ISettingsStorage using browser localStorage.
 */
export class LocalStorageSettingsAdapter implements ISettingsStorage {
    private static readonly THEME_KEY = 'theme';
    private static readonly CONTRAST_KEY = 'contrast';

    getTheme(): Theme | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(LocalStorageSettingsAdapter.THEME_KEY) as Theme | null;
    }

    setTheme(theme: Theme): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(LocalStorageSettingsAdapter.THEME_KEY, theme);
    }

    getContrast(): Contrast | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(LocalStorageSettingsAdapter.CONTRAST_KEY) as Contrast | null;
    }

    setContrast(contrast: Contrast): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(LocalStorageSettingsAdapter.CONTRAST_KEY, contrast);
    }
}

/**
 * Default settings storage instance
 */
export const defaultSettingsStorage = new LocalStorageSettingsAdapter();
