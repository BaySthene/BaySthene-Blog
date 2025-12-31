import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getAllPostSlugs, markdownToHtml } from '@/lib/markdown';
import BlogContent from '@/components/BlogContent';
import ReadingProgress from '@/components/ReadingProgress';
import TableOfContents from '@/components/TableOfContents';
import ShareButtons from '@/components/ShareButtons';
import { ArrowBackIcon } from '@/components/Icons';
import { getShimmerPlaceholder } from '@/lib/image';
import styles from './page.module.css';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return { title: 'Yazı Bulunamadı' };
    }

    return {
        title: post.title,
        description: post.excerpt,
        alternates: {
            canonical: `/blog/${slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            images: [post.coverImage],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const content = await markdownToHtml(post.content);
    const formattedDate = new Date(post.date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <>
            <ReadingProgress />
            <div className={styles.layout}>
                <article className={styles.article}>
                    <div className={styles.header}>
                        <Link href="/" className={styles.backLink}>
                            <ArrowBackIcon size={20} />
                            Ana Sayfaya Dön
                        </Link>

                        <div className={styles.meta}>
                            <time dateTime={post.date}>{formattedDate}</time>
                            <span className={styles.separator}>•</span>
                            <span>{post.readingTime} dk okuma</span>
                        </div>

                        <h1 className={styles.title}>{post.title}</h1>

                        {post.tags.length > 0 && (
                            <div className={styles.tags}>
                                {post.tags.map((tag) => (
                                    <span key={tag} className={styles.tag}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.coverImageContainer}>
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 800px"
                            className={styles.coverImage}
                            priority
                            placeholder="blur"
                            blurDataURL={getShimmerPlaceholder(800, 450)}
                        />
                    </div>

                    <BlogContent html={content} />

                    <ShareButtons title={post.title} />
                </article>

                <aside className={styles.sidebar}>
                    <TableOfContents />
                </aside>
            </div>
        </>
    );
}

