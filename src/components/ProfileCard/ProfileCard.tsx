import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/lib/config';
import { GitHubIcon, LinkedInIcon, DownloadIcon } from '@/components/Icons';
import { type Locale } from '@/i18n/config';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
    author?: typeof siteConfig.author;
    locale: Locale;
}

export default async function ProfileCard({ author = siteConfig.author, locale }: ProfileCardProps) {
    const t = await getTranslations('profile');

    return (
        <aside className={styles.card}>
            <div className={styles.avatarWrapper}>
                <Image
                    src={author.avatar}
                    alt={author.name}
                    width={80}
                    height={80}
                    className={styles.avatar}
                />
            </div>

            <h2 className={styles.name}>{author.name}</h2>
            <p className={styles.bio}>{author.bio}</p>

            <div className={styles.links}>
                {author.links.github && (
                    <a
                        href={author.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkButton}
                        aria-label="GitHub"
                    >
                        <GitHubIcon size={20} />
                        <span>GitHub</span>
                    </a>
                )}

                {author.links.linkedin && (
                    <a
                        href={author.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkButton}
                        aria-label="LinkedIn"
                    >
                        <LinkedInIcon size={20} />
                        <span>LinkedIn</span>
                    </a>
                )}

                {author.links.cv && (
                    <a
                        href={author.links.cv}
                        download
                        className={`${styles.linkButton} ${styles.cvButton}`}
                        aria-label={t('downloadCV')}
                    >
                        <DownloadIcon size={20} />
                        <span>{t('downloadCV')}</span>
                    </a>
                )}
            </div>
        </aside>
    );
}
