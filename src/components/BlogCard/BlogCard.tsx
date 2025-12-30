import Link from 'next/link';
import Image from 'next/image';
import styles from './BlogCard.module.css';
import { BlogPostMeta } from '@/lib/types';

interface BlogCardProps {
    post: BlogPostMeta;
    variant?: 'default' | 'compact';
}

export default function BlogCard({ post, variant = 'default' }: BlogCardProps) {
    const formattedDate = new Date(post.date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <article className={`${styles.card} ${styles[variant]}`}>
            <Link href={`/blog/${post.slug}`} className={styles.imageLink}>
                <div className={styles.imageContainer}>
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.image}
                    />
                </div>
            </Link>

            <div className={styles.content}>
                <div className={styles.meta}>
                    <time dateTime={post.date} className={styles.date}>
                        {formattedDate}
                    </time>
                    <span className={styles.readingTime}>{post.readingTime} dk okuma</span>
                </div>

                <Link href={`/blog/${post.slug}`} className={styles.titleLink}>
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
