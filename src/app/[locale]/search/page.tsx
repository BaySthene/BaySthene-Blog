import { Metadata } from 'next';
import InfinitePostList from '@/components/InfinitePostList';
import { searchPosts, getAllPosts } from '@/lib/markdown';
import styles from './page.module.css';

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
    title: 'Arama',
    description: 'Blog yazılarında arama yapın',
};

const POSTS_PER_PAGE = 6;

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q: query } = await searchParams;
    const allPosts = query ? searchPosts(query) : getAllPosts();

    // Get initial posts for SSR
    const initialPosts = allPosts.slice(0, POSTS_PER_PAGE);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {query ? `"${query}" için sonuçlar` : 'Tüm Yazılar'}
                </h1>
                <p className={styles.resultCount}>
                    {allPosts.length} yazı {query ? 'bulundu' : 'mevcut'}
                </p>
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
                    <h2>Sonuç bulunamadı</h2>
                    <p>"{query}" ile eşleşen yazı bulunamadı. Farklı anahtar kelimeler deneyin.</p>
                </div>
            )}
        </div>
    );
}
