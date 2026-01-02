import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/config';
import { ServiceFactory } from '@/application/factories';
import styles from './page.module.css';

interface TagsPageProps {
    params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: TagsPageProps): Promise<Metadata> {
    await params; // Await params for request context
    const t = await getTranslations('tags');
    return {
        title: t('title'),
        description: t('metaDescription'),
    };
}

export default async function TagsPage({ params }: TagsPageProps) {
    const { locale } = await params;
    const t = await getTranslations('tags');

    const { getAllTags } = ServiceFactory.getBlogServices();
    const domainTags = await getAllTags.execute();

    // Transform to presentation format
    const tags = domainTags.map(tc => ({ tag: tc.tag.value, count: tc.count }));

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.description}>
                    {t('description')}
                </p>
            </div>

            <div className={styles.tagCloud}>
                {tags.map(({ tag, count }) => (
                    <Link
                        key={tag}
                        href={`/${locale}/tags/${encodeURIComponent(tag.toLowerCase())}`}
                        className={`${styles.tag} ${count > 2 ? styles.popular : ''}`}
                    >
                        <span className={styles.tagName}>{tag}</span>
                        <span className={styles.tagCount}>{count}</span>
                    </Link>
                ))}
            </div>

            {tags.length === 0 && (
                <div className={styles.emptyState}>
                    <p>{t('emptyState')}</p>
                </div>
            )}
        </div>
    );
}
