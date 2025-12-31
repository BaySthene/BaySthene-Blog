import { Metadata } from 'next';
import Link from 'next/link';
import { getAllTags } from '@/lib/markdown';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Etiketler',
    description: 'Blog yazılarına göre etiket listesi',
};

export default function TagsPage() {
    const tags = getAllTags();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Etiketler</h1>
                <p className={styles.description}>
                    Tüm blog yazılarını kategorilere göre keşfedin
                </p>
            </div>

            <div className={styles.tagCloud}>
                {tags.map(({ tag, count }) => (
                    <Link
                        key={tag}
                        href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
                        className={`${styles.tag} ${count > 2 ? styles.popular : ''}`}
                    >
                        <span className={styles.tagName}>{tag}</span>
                        <span className={styles.tagCount}>{count}</span>
                    </Link>
                ))}
            </div>

            {tags.length === 0 && (
                <div className={styles.emptyState}>
                    <p>Henüz etiket yok.</p>
                </div>
            )}
        </div>
    );
}
