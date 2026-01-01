import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import InfinitePostList from '@/components/InfinitePostList';
import { searchPosts, getAllPosts } from '@/application/adapters';
import { type Locale } from '@/i18n/config';
import styles from './page.module.css';

interface SearchPageProps {
    params: Promise<{ locale: Locale }>;
    searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
    await params; // Await params but we only need the request context for translations
    const t = await getTranslations('search');
    return {
        title: t('searchPageTitle'),
        description: t('searchPageDescription'),
    };
}

const POSTS_PER_PAGE = 6;

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
    const { locale } = await params;
    const { q: query } = await searchParams;

    setRequestLocale(locale);

    const t = await getTranslations('search');
    const allPosts = query ? await searchPosts(query) : await getAllPosts();

    // Get initial posts for SSR
    const initialPosts = allPosts.slice(0, POSTS_PER_PAGE);

    const titleText = query
        ? `"${query}" ${t('resultsFor')}`
        : t('title');

    const countText = `${allPosts.length} ${t('posts')} ${query ? t('postsFound') : t('postsAvailable')}`;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{titleText}</h1>
                <p className={styles.resultCount}>{countText}</p>
            </div>

            {allPosts.length > 0 ? (
                <InfinitePostList
                    initialPosts={initialPosts}
                    query={query}
                    postsPerPage={POSTS_PER_PAGE}
                />
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🔍</div>
                    <h2>{t('noResults')}</h2>
                    <p>
                        {`"${query}" ${t('noMatchingPosts')}`}
                    </p>
                </div>
            )}
        </div>
    );
}
