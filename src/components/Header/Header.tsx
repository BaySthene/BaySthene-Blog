'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import SearchBar from '@/components/SearchBar';
import { SettingsIcon, LightModeIcon, DarkModeIcon, LanguageIcon } from '@/components/Icons';
import { locales, type Locale } from '@/i18n/config';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './Header.module.css';

interface HeaderProps {
    locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
    const t = useTranslations('common');
    const pathname = usePathname();
    const router = useRouter();
    const { theme, contrast, setTheme, setContrast } = useTheme();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    const basePath = `/${locale}`;

    // Mark component as mounted (client-side only)
    useEffect(() => {
        setIsMounted(true);
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
                                            onClick={() => setTheme('light')}
                                        >
                                            <LightModeIcon size={18} aria-hidden="true" />
                                            <span>{t('light')}</span>
                                        </button>
                                        <button
                                            className={`${styles.settingsOption} ${theme === 'dark' ? styles.active : ''}`}
                                            onClick={() => setTheme('dark')}
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
                                            onClick={() => setContrast('default')}
                                        >
                                            <span>{t('default')}</span>
                                        </button>
                                        <button
                                            className={`${styles.settingsOption} ${contrast === 'high' ? styles.active : ''}`}
                                            onClick={() => setContrast('high')}
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
