import Link from 'next/link';
import Image from 'next/image';
import styles from './FeaturedPost.module.css';
import { BlogPostMeta } from '@/lib/types';

interface FeaturedPostProps {
    post: BlogPostMeta;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
    const formattedDate = new Date(post.date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <article className={styles.featured}>
            <Link href={`/blog/${post.slug}`} className={styles.imageLink}>
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
                <span className={styles.badge}>Son Yazı</span>

                <div className={styles.meta}>
                    <time dateTime={post.date} className={styles.date}>
                        {formattedDate}
                    </time>
                    <span className={styles.readingTime}>{post.readingTime} dk okuma</span>
                </div>

                <Link href={`/blog/${post.slug}`} className={styles.titleLink}>
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

                <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                    Devamını Oku
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                    </svg>
                </Link>
            </div>
        </article>
    );
}
