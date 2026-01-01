import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/config';
import { siteConfig } from '@/lib/config';
import styles from './page.module.css';
import { GitHubIcon, LinkedInIcon, TwitterIcon } from '@/components/Icons';

interface AboutPageProps {
    params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
    await params; // Await params for request context
    const t = await getTranslations('about');
    return {
        title: t('title'),
        description: t('metaDescription'),
    };
}

export default async function AboutPage({ params }: AboutPageProps) {
    const { locale } = await params;
    const t = await getTranslations('about');
    const tCommon = await getTranslations('common');
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <div className={styles.avatarWrapper}>
                    <div className={styles.avatarGlow}></div>
                    <div className={styles.avatar}>
                        <span className={styles.avatarText}>MU</span>
                    </div>
                </div>

                <h1 className={styles.name}>{siteConfig.author.name}</h1>
                <p className={styles.role}>{t('role')}</p>
            </div>

            <div className={styles.content}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{siteConfig.about.title}</h2>
                    <p className={styles.text}>
                        {siteConfig.about.description}
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('expertiseTitle')}</h2>
                    <div className={styles.skills}>
                        {siteConfig.skills.map((skill) => (
                            <span key={skill} className={styles.skill}>{skill}</span>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('contactTitle')}</h2>
                    <div className={styles.links}>
                        {siteConfig.author.links.github && (
                            <a
                                href={siteConfig.author.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                            >
                                <GitHubIcon size={24} />
                                {tCommon('github')}
                            </a>
                        )}
                        {siteConfig.author.links.twitter && (
                            <a
                                href={siteConfig.author.links.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                            >
                                <TwitterIcon size={24} />
                                {tCommon('twitter')}
                            </a>
                        )}
                        {siteConfig.author.links.linkedin && (
                            <a
                                href={siteConfig.author.links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                            >
                                <LinkedInIcon size={24} />
                                {tCommon('linkedin')}
                            </a>
                        )}
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('blogAboutTitle')}</h2>
                    <p className={styles.text}>
                        {t('blogDescription')}
                    </p>
                    <div className={styles.techStack}>
                        <span className={styles.tech}>Next.js 15</span>
                        <span className={styles.tech}>TypeScript</span>
                        <span className={styles.tech}>Material Design 3</span>
                        <span className={styles.tech}>CSS Modules</span>
                    </div>
                </section>
            </div>

            <div className={styles.cta}>
                <Link href={`/${locale}`} className={styles.ctaButton}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                    {t('viewPostsCta')}
                </Link>
            </div>
        </div>
    );
}
