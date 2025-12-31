import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import styles from './BlogCard.module.css';
import { BlogPostMeta } from '@/lib/types';
import { getShimmerPlaceholder } from '@/lib/image';
import { type Locale } from '@/i18n/config';

interface BlogCardProps {
    post: BlogPostMeta;
    locale: Locale;
    variant?: 'default' | 'compact';
}

export default async function BlogCard({ post, locale, variant = 'default' }: BlogCardProps) {
    const t = await getTranslations('home');

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
            <Link href={blogPath} className={styles.imageLink}>
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
