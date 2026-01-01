'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import SearchBar from '@/components/SearchBar';
import { useTranslations } from 'next-intl';
import { Navigation } from './Navigation';
import { SettingsPanel, SettingsToggle } from './SettingsPanel';
import styles from './Header.module.css';

interface HeaderProps {
    locale: Locale;
}

/**
 * Header Component
 *
 * Responsibilities:
 * - Layout composition of Logo, Navigation, SearchBar, Settings
 * - Scroll state management
 * - Settings panel open/close state
 *
 * Delegates to:
 * - Navigation: nav links
 * - SettingsPanel: theme/contrast/locale controls
 */
export default function Header({ locale }: HeaderProps) {
    const t = useTranslations('common');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMounted] = useState(() => typeof window !== 'undefined');
    const settingsRef = useRef<HTMLDivElement>(null);

    const basePath = `/${locale}`;

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
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

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href={basePath} className={styles.logo}>
                    <span className={styles.logoIcon}>📝</span>
                    <span className={styles.logoText}>BaySthene</span>
                </Link>

                {/* Navigation */}
                <Navigation locale={locale} />

                {/* Actions */}
                <div className={styles.actions}>
                    <SearchBar placeholder={t('search')} />

                    {/* Settings */}
                    <div className={styles.settingsWrapper} ref={settingsRef}>
                        <SettingsToggle
                            isOpen={isSettingsOpen}
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        />
                        {isMounted && (
                            <SettingsPanel
                                isOpen={isSettingsOpen}
                                locale={locale}
                                onClose={() => setIsSettingsOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
