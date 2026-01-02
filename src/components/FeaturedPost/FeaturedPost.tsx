import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import styles from './FeaturedPost.module.css';
import { PostViewModel } from '@/presentation/types';
import { type Locale } from '@/i18n/config';

interface FeaturedPostProps {
    post: PostViewModel;
    locale: Locale;
}


export default async function FeaturedPost({ post, locale }: FeaturedPostProps) {
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
        <article className={styles.featured}>
            <Link href={blogPath} className={styles.imageLink}>
                <div className={styles.imageContainer}>
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className={styles.image}
                        priority
                    />
                    <div className={styles.overlay} />
                </div>
            </Link>

            <div className={styles.content}>
                <span className={styles.badge}>{t('latestPost')}</span>

                <div className={styles.meta}>
                    <time dateTime={post.date} className={styles.date}>
                        {formattedDate}
                    </time>
                    <span className={styles.readingTime}>
                        {post.readingTime} {t('minRead')}
                    </span>
                </div>

                <Link href={blogPath} className={styles.titleLink}>
                    <h2 className={styles.title}>{post.title}</h2>
                </Link>

                <p className={styles.excerpt}>{post.excerpt}</p>

                {post.tags.length > 0 && (
                    <div className={styles.tags}>
                        {post.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <Link href={blogPath} className={styles.readMore}>
                    {t('readMore')}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                    </svg>
                </Link>
            </div>
        </article>
    );
}
