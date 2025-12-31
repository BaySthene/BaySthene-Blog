import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import InfinitePostList from '@/components/InfinitePostList';
import { searchPosts, getAllPosts } from '@/lib/markdown';
import { type Locale } from '@/i18n/config';
import styles from './page.module.css';

interface SearchPageProps {
    params: Promise<{ locale: Locale }>;
    searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === 'tr' ? 'Arama' : 'Search',
        description: locale === 'tr'
            ? 'Blog yazılarında arama yapın'
            : 'Search blog posts',
    };
}

const POSTS_PER_PAGE = 6;

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
    const { locale } = await params;
    const { q: query } = await searchParams;

    setRequestLocale(locale);

    const t = await getTranslations('search');
    const allPosts = query ? searchPosts(query) : getAllPosts();

    // Get initial posts for SSR
    const initialPosts = allPosts.slice(0, POSTS_PER_PAGE);

    const titleText = query
        ? `"${query}" ${locale === 'tr' ? 'için sonuçlar' : 'results'}`
        : t('title');

    const countText = locale === 'tr'
        ? `${allPosts.length} yazı ${query ? 'bulundu' : 'mevcut'}`
        : `${allPosts.length} posts ${query ? 'found' : 'available'}`;

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
                        {locale === 'tr'
                            ? `"${query}" ile eşleşen yazı bulunamadı. Farklı anahtar kelimeler deneyin.`
                            : `No posts matching "${query}". Try different keywords.`}
                    </p>
                </div>
            )}
        </div>
    );
}
