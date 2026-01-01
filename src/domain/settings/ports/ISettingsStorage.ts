/**
 * Theme Types
 */
export type Theme = 'light' | 'dark';
export type Contrast = 'default' | 'medium' | 'high';

/**
 * Settings Storage Interface
 *
 * Defines the contract for persisting user settings.
 * Implementation details (localStorage, cookies, etc.) are hidden.
 */
export interface ISettingsStorage {
    /**
     * Gets the saved theme preference
     */
    getTheme(): Theme | null;

    /**
     * Saves the theme preference
     */
    setTheme(theme: Theme): void;

    /**
     * Gets the saved contrast preference
     */
    getContrast(): Contrast | null;

    /**
     * Sets the contrast preference
     */
    setContrast(contrast: Contrast): void;
}
