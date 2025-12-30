import { Metadata } from 'next';
import BlogCard from '@/components/BlogCard';
import { searchPosts, getAllPosts } from '@/lib/markdown';
import styles from './page.module.css';

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
    title: 'Arama',
    description: 'Blog yazılarında arama yapın',
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q: query } = await searchParams;
    const posts = query ? searchPosts(query) : getAllPosts();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {query ? `"${query}" için sonuçlar` : 'Tüm Yazılar'}
                </h1>
                {query && (
                    <p className={styles.resultCount}>
                        {posts.length} yazı bulundu
                    </p>
                )}
            </div>

            {posts.length > 0 ? (
                <div className={styles.grid}>
                    {posts.map((post) => (
                        <BlogCard key={post.slug} post={post} />
                    ))}
                </div>
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
