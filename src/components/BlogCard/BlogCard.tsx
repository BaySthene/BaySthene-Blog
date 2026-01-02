'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import styles from './BlogCard.module.css';
import { PostViewModel } from '@/presentation/types';
import { getShimmerPlaceholder } from '@/lib/image';

interface BlogCardProps {
    post: PostViewModel;

    // Locale prop is optional now as we can use useLocale hook, 
    // but keeping it for compatibility with explicit passing if needed
    variant?: 'default' | 'compact';
}

export default function BlogCard({ post, variant = 'default' }: BlogCardProps) {
    const locale = useLocale();
    const t = useTranslations('home');

    const formattedDate = new Date(post.date).toLocaleDateString(
        locale === 'tr' ? 'tr-TR' : 'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
    );

    const blogPath = `/${locale}/blog/${post.slug}`;

    return (
        <article className={`${styles.card} ${styles[variant]}`}>
            <Link
                href={blogPath}
                className={styles.imageLink}
                aria-hidden="true"
                tabIndex={-1}
            >
                <div className={styles.imageContainer}>
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.image}
                        placeholder="blur"
                        blurDataURL={getShimmerPlaceholder(400, 225)}
                    />
                </div>
            </Link>

            <div className={styles.content}>
                <div className={styles.meta}>
                    <time dateTime={post.date} className={styles.date}>
                        {formattedDate}
                    </time>
                    <span className={styles.readingTime}>
                        {post.readingTime} {t('minRead')}
                    </span>
                </div>

                <Link href={blogPath} className={styles.titleLink}>
                    <h3 className={styles.title}>{post.title}</h3>
                </Link>

                <p className={styles.excerpt}>{post.excerpt}</p>

                {post.tags.length > 0 && (
                    <div className={styles.tags}>
                        {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}
