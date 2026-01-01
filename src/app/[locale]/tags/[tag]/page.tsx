import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/config';
import BlogCard from '@/components/BlogCard';
import { getPostsByTag, getAllTags } from '@/application/adapters';
import styles from './page.module.css';

interface TagPageProps {
    params: Promise<{ tag: string; locale: Locale }>;
}

export async function generateStaticParams() {
    const tags = await getAllTags();
    return tags.map(({ tag }) => ({
        tag: encodeURIComponent(tag.toLowerCase())
    }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag);
    const t = await getTranslations('tags');

    return {
        title: `${decodedTag} ${t('taggedPostsMetaTitle')}`,
        description: `${decodedTag} ${t('taggedPostsMetaDescription')}`,
    };
}

export default async function TagPage({ params }: TagPageProps) {
    const { tag, locale } = await params;
    const t = await getTranslations('tags');
    const decodedTag = decodeURIComponent(tag);
    const posts = await getPostsByTag(decodedTag);

    if (posts.length === 0) {
        notFound();
    }

    // Find original tag case
    const tags = await getAllTags();
    const originalTag = tags.find(t => t.tag.toLowerCase() === decodedTag.toLowerCase())?.tag || decodedTag;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href={`/${locale}/tags`} className={styles.backLink}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                    {t('allTags')}
                </Link>

                <div className={styles.tagBadge}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
                    </svg>
                    {originalTag}
                </div>

                <h1 className={styles.title}>
                    <span className={styles.highlight}>{originalTag}</span> {t('taggedPosts')}
                </h1>
                <p className={styles.count}>{posts.length} {t('postsCount')}</p>
            </div>

            <div className={styles.grid}>
                {posts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                ))}
            </div>
        </div>
    );
}
