'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/lib/config';
import { GitHubIcon, LinkedInIcon } from '@/components/Icons';
import { type Locale } from '@/i18n/config';
import styles from './Footer.module.css';

interface FooterProps {
    locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
    const t = useTranslations('common');
    const basePath = `/${locale}`;

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand */}
                    <div className={styles.brand}>
                        <Link href={basePath} className={styles.logo}>
                            <span className={styles.logoIcon}>📝</span>
                            <span className={styles.logoText}>BaySthene</span>
                        </Link>
                        <p className={styles.description}>
                            {siteConfig.description}
                        </p>
                    </div>

                    {/* Links */}
                    <div className={styles.links}>
                        <h4 className={styles.linksTitle}>{t('links')}</h4>
                        <nav className={styles.linksNav}>
                            <Link href={basePath}>{t('home')}</Link>
                            <Link href={`${basePath}/search`}>{t('allPosts')}</Link>
                            <Link href={`${basePath}/tags`}>{t('tags')}</Link>
                            <Link href={`${basePath}/about`}>{t('about')}</Link>
                        </nav>
                    </div>

                    {/* Social */}
                    <div className={styles.social}>
                        <h4 className={styles.socialTitle}>{t('social')}</h4>
                        <div className={styles.socialLinks}>
                            <a
                                href={siteConfig.author.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t('github')}
                                className={styles.socialLink}
                            >
                                <GitHubIcon size={20} />
                            </a>
                            <a
                                href={siteConfig.author.links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t('linkedin')}
                                className={styles.socialLink}
                            >
                                <LinkedInIcon size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        {t('copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
