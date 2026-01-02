'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { SettingsIcon, LightModeIcon, DarkModeIcon, LanguageIcon } from '@/components/Icons';
import { locales, type Locale } from '@/i18n/config';
import { useTheme, type Theme, type Contrast } from '@/contexts/ThemeContext';
import styles from './Header.module.css';

interface SettingsPanelProps {
    isOpen: boolean;
    locale: Locale;
    onClose: () => void;
}

export function SettingsPanel({ isOpen, locale, onClose }: SettingsPanelProps) {
    const t = useTranslations('common');
    const pathname = usePathname();
    const router = useRouter();
    const { theme, contrast, setTheme, setContrast } = useTheme();

    const switchLocale = (newLocale: Locale) => {
        if (newLocale === locale) {
            onClose();
            return;
        }

        const segments = pathname.split('/');
        segments[1] = newLocale;
        const newPath = segments.join('/') || `/${newLocale}`;

        router.push(newPath);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.settingsMenu}>
            {/* Theme Section */}
            <SettingsSection label={t('theme')}>
                <ThemeOption
                    theme="light"
                    currentTheme={theme}
                    onClick={() => setTheme('light')}
                    label={t('light')}
                    icon={<LightModeIcon size={18} aria-hidden="true" />}
                />
                <ThemeOption
                    theme="dark"
                    currentTheme={theme}
                    onClick={() => setTheme('dark')}
                    label={t('dark')}
                    icon={<DarkModeIcon size={18} aria-hidden="true" />}
                />
            </SettingsSection>

            <div className={styles.settingsDivider} />

            {/* Contrast Section */}
            <SettingsSection label={t('contrast')}>
                <ContrastOption
                    contrast="default"
                    currentContrast={contrast}
                    onClick={() => setContrast('default')}
                    label={t('default')}
                />
                <ContrastOption
                    contrast="high"
                    currentContrast={contrast}
                    onClick={() => setContrast('high')}
                    label={t('high')}
                />
            </SettingsSection>

            <div className={styles.settingsDivider} />

            {/* Language Section */}
            <SettingsSection
                label={
                    <>
                        <LanguageIcon size={16} aria-hidden="true" />
                        {t('language')}
                    </>
                }
            >
                {locales.map((loc) => (
                    <button
                        key={loc}
                        className={`${styles.settingsOption} ${locale === loc ? styles.active : ''}`}
                        onClick={() => switchLocale(loc)}
                    >
                        <span>{loc === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}</span>
                    </button>
                ))}
            </SettingsSection>
        </div>
    );
}

// Sub-components

function SettingsSection({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className={styles.settingsSection}>
            <span className={styles.settingsLabel}>{label}</span>
            <div className={styles.settingsOptions}>{children}</div>
        </div>
    );
}

function ThemeOption({
    theme,
    currentTheme,
    onClick,
    label,
    icon,
}: {
    theme: Theme;
    currentTheme: Theme;
    onClick: () => void;
    label: string;
    icon: React.ReactNode;
}) {
    return (
        <button
            className={`${styles.settingsOption} ${currentTheme === theme ? styles.active : ''}`}
            onClick={onClick}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function ContrastOption({
    contrast,
    currentContrast,
    onClick,
    label,
}: {
    contrast: Contrast;
    currentContrast: Contrast;
    onClick: () => void;
    label: string;
}) {
    return (
        <button
            className={`${styles.settingsOption} ${currentContrast === contrast ? styles.active : ''}`}
            onClick={onClick}
        >
            <span>{label}</span>
        </button>
    );
}

// Settings toggle button component
interface SettingsToggleProps {
    isOpen: boolean;
    onClick: () => void;
}

export function SettingsToggle({ isOpen, onClick }: SettingsToggleProps) {
    const t = useTranslations('common');

    return (
        <button
            type="button"
            className={styles.settingsToggle}
            onClick={onClick}
            aria-label={t('theme')}
            aria-expanded={isOpen}
        >
            <SettingsIcon size={20} aria-hidden="true" />
        </button>
    );
}
