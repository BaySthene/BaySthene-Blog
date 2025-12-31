'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import SearchBar from '@/components/SearchBar';
import { SettingsIcon, LightModeIcon, DarkModeIcon, LanguageIcon } from '@/components/Icons';
import { locales, type Locale } from '@/i18n/config';
import styles from './Header.module.css';

type Theme = 'light' | 'dark';
type Contrast = 'default' | 'medium' | 'high';

interface HeaderProps {
    locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
    const t = useTranslations('common');
    const pathname = usePathname();
    const router = useRouter();

    const [theme, setTheme] = useState<Theme>('light');
    const [contrast, setContrast] = useState<Contrast>('default');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    const basePath = `/${locale}`;

    // Mark component as mounted (client-side only)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Load saved preferences
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        const savedContrast = localStorage.getItem('contrast') as Contrast | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        const initialContrast = savedContrast || 'default';

        setTheme(initialTheme);
        setContrast(initialContrast);
        applyTheme(initialTheme, initialContrast);
    }, []);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close settings menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const applyTheme = (newTheme: Theme, newContrast: Contrast) => {
        document.documentElement.setAttribute('data-theme', newTheme);
        if (newContrast === 'default') {
            document.documentElement.removeAttribute('data-contrast');
        } else {
            document.documentElement.setAttribute('data-contrast', newContrast);
        }
    };

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme, contrast);
    };

    const handleContrastChange = (newContrast: Contrast) => {
        setContrast(newContrast);
        localStorage.setItem('contrast', newContrast);
        applyTheme(theme, newContrast);
    };

    const switchLocale = (newLocale: Locale) => {
        if (newLocale === locale) {
            setIsSettingsOpen(false);
            return;
        }

        // Replace the locale segment in the pathname
        const segments = pathname.split('/');
        segments[1] = newLocale;
        const newPath = segments.join('/') || `/${newLocale}`;

        router.push(newPath);
        setIsSettingsOpen(false);
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href={basePath} className={styles.logo}>
                    <span className={styles.logoIcon}>📝</span>
                    <span className={styles.logoText}>BaySthene</span>
                </Link>

                <nav className={styles.nav}>
                    <Link href={basePath} className={styles.navLink}>
                        {t('home')}
                    </Link>
                    <Link href={`${basePath}/search`} className={styles.navLink}>
                        {t('allPosts')}
                    </Link>
                    <Link href={`${basePath}/tags`} className={styles.navLink}>
                        {t('tags')}
                    </Link>
                    <Link href={`${basePath}/about`} className={styles.navLink}>
                        {t('about')}
                    </Link>
                </nav>

                <div className={styles.actions}>
                    <SearchBar placeholder={t('search')} />

                    {/* Settings Menu - only render interactive content after mount */}
                    <div className={styles.settingsWrapper} ref={settingsRef}>
                        <button
                            type="button"
                            className={styles.settingsToggle}
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            aria-label={t('theme')}
                            aria-expanded={isSettingsOpen}
                        >
                            <SettingsIcon size={20} aria-hidden="true" />
                        </button>

                        {isMounted && isSettingsOpen && (
                            <div className={styles.settingsMenu}>
                                {/* Theme Section */}
                                <div className={styles.settingsSection}>
                                    <span className={styles.settingsLabel}>{t('theme')}</span>
                                    <div className={styles.settingsOptions}>
                                        <button
                                            className={`${styles.settingsOption} ${theme === 'light' ? styles.active : ''}`}
                                            onClick={() => handleThemeChange('light')}
                                        >
                                            <LightModeIcon size={18} aria-hidden="true" />
                                            <span>{t('light')}</span>
                                        </button>
                                        <button
                                            className={`${styles.settingsOption} ${theme === 'dark' ? styles.active : ''}`}
                                            onClick={() => handleThemeChange('dark')}
                                        >
                                            <DarkModeIcon size={18} aria-hidden="true" />
                                            <span>{t('dark')}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.settingsDivider} />

                                {/* Contrast Section */}
                                <div className={styles.settingsSection}>
                                    <span className={styles.settingsLabel}>{t('contrast')}</span>
                                    <div className={styles.settingsOptions}>
                                        <button
                                            className={`${styles.settingsOption} ${contrast === 'default' ? styles.active : ''}`}
                                            onClick={() => handleContrastChange('default')}
                                        >
                                            <span>{t('default')}</span>
                                        </button>
                                        <button
                                            className={`${styles.settingsOption} ${contrast === 'high' ? styles.active : ''}`}
                                            onClick={() => handleContrastChange('high')}
                                        >
                                            <span>{t('high')}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.settingsDivider} />

                                {/* Language Section */}
                                <div className={styles.settingsSection}>
                                    <span className={styles.settingsLabel}>
                                        <LanguageIcon size={16} aria-hidden="true" />
                                        {t('language')}
                                    </span>
                                    <div className={styles.settingsOptions}>
                                        {locales.map((loc) => (
                                            <button
                                                key={loc}
                                                className={`${styles.settingsOption} ${locale === loc ? styles.active : ''}`}
                                                onClick={() => switchLocale(loc)}
                                            >
                                                <span>{loc === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
