'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import { SettingsIcon, LightModeIcon, DarkModeIcon } from '@/components/Icons';
import styles from './Header.module.css';

type Theme = 'light' | 'dark';
type Contrast = 'default' | 'medium' | 'high';

export default function Header() {
    const [theme, setTheme] = useState<Theme>('light');
    const [contrast, setContrast] = useState<Contrast>('default');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

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

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>📝</span>
                    <span className={styles.logoText}>BaySthene</span>
                </Link>

                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>
                        Ana Sayfa
                    </Link>
                    <Link href="/search" className={styles.navLink}>
                        Tüm Yazılar
                    </Link>
                    <Link href="/tags" className={styles.navLink}>
                        Etiketler
                    </Link>
                    <Link href="/about" className={styles.navLink}>
                        Hakkımda
                    </Link>
                </nav>

                <div className={styles.actions}>
                    <SearchBar />

                    {/* Settings Menu - only render interactive content after mount */}
                    <div className={styles.settingsWrapper} ref={settingsRef}>
                        <button
                            type="button"
                            className={styles.settingsToggle}
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            aria-label="Tema Ayarları"
                            aria-expanded={isSettingsOpen}
                        >
                            <SettingsIcon size={20} />
                        </button>

                        {isMounted && isSettingsOpen && (
                            <div className={styles.settingsMenu}>
                                <div className={styles.settingsSection}>
                                    <span className={styles.settingsLabel}>Tema</span>
                                    <div className={styles.settingsOptions}>
                                        <button
                                            className={`${styles.settingsOption} ${theme === 'light' ? styles.active : ''}`}
                                            onClick={() => handleThemeChange('light')}
                                        >
                                            <LightModeIcon size={18} />
                                            <span>Açık</span>
                                        </button>
                                        <button
                                            className={`${styles.settingsOption} ${theme === 'dark' ? styles.active : ''}`}
                                            onClick={() => handleThemeChange('dark')}
                                        >
                                            <DarkModeIcon size={18} />
                                            <span>Koyu</span>
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.settingsDivider} />

                                <div className={styles.settingsSection}>
                                    <span className={styles.settingsLabel}>Kontrast</span>
                                    <div className={styles.settingsOptions}>
                                        <button
                                            className={`${styles.settingsOption} ${contrast === 'default' ? styles.active : ''}`}
                                            onClick={() => handleContrastChange('default')}
                                        >
                                            <span>Normal</span>
                                        </button>
                                        <button
                                            className={`${styles.settingsOption} ${contrast === 'medium' ? styles.active : ''}`}
                                            onClick={() => handleContrastChange('medium')}
                                        >
                                            <span>Orta</span>
                                        </button>
                                        <button
                                            className={`${styles.settingsOption} ${contrast === 'high' ? styles.active : ''}`}
                                            onClick={() => handleContrastChange('high')}
                                        >
                                            <span>Yüksek</span>
                                        </button>
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
