'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { type Locale } from '@/i18n/config';
import styles from './Header.module.css';

interface NavigationProps {
    locale: Locale;
}

export function Navigation({ locale }: NavigationProps) {
    const t = useTranslations('common');
    const basePath = `/${locale}`;

    return (
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
    );
}
