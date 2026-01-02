import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ServiceFactory } from '@/application/factories';
import BlogContent from '@/components/BlogContent';
import ReadingProgress from '@/components/ReadingProgress';
import TableOfContents from '@/components/TableOfContents';
import ShareButtons from '@/components/ShareButtons';
import ReadingTracker from '@/components/ReadingTracker';
import { ArrowBackIcon } from '@/components/Icons';
import { getShimmerPlaceholder } from '@/lib/image';
import { locales, type Locale } from '@/i18n/config';
import styles from './page.module.css';

interface BlogPostPageProps {
    params: Promise<{ slug: string; locale: Locale }>;
}

export async function generateStaticParams() {
    const { getAllSlugs } = ServiceFactory.getBlogServices();
    const slugs = await getAllSlugs.execute();
    return locales.flatMap((locale) =>
        slugs.map((slug) => ({ locale, slug: slug.value }))
    );
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug, locale } = await params;
    const { getPostBySlug } = ServiceFactory.getBlogServices();

    try {
        const post = await getPostBySlug.execute(slug);

        if (!post) {
            return { title: locale === 'tr' ? 'Yazı Bulunamadı' : 'Post Not Found' };
        }

        return {
            title: post.title,
            description: post.excerpt,
            alternates: {
                canonical: `/${locale}/blog/${slug}`,
            },
            openGraph: {
                title: post.title,
                description: post.excerpt,
                type: 'article',
                publishedTime: post.date.toISOString(),
                images: [post.coverImage],
            },
        };
    } catch {
        return { title: locale === 'tr' ? 'Yazı Bulunamadı' : 'Post Not Found' };
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug, locale } = await params;

    setRequestLocale(locale);

    const { getPostBySlug, contentParser } = ServiceFactory.getBlogServices();

    let post;
    try {
        post = await getPostBySlug.execute(slug);
    } catch {
        notFound();
    }

    const tHome = await getTranslations('home');

    if (!post) {
        notFound();
    }

    const content = await contentParser.toHtml(post.content);
    const formattedDate = post.date.toLocaleDateString(
        locale === 'tr' ? 'tr-TR' : 'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
    );

    const minReadText = tHome('minRead');
    const backText = locale === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home';

    return (
        <>
            <ReadingProgress />
            <ReadingTracker slug={slug} readingTime={post.readingTimeMinutes} />
            <div className={styles.layout}>
                <article className={styles.article}>
                    <div className={styles.header}>
                        <Link href={`/${locale}`} className={styles.backLink}>
                            <ArrowBackIcon size={20} />
                            {backText}
                        </Link>

                        <div className={styles.meta}>
                            <time dateTime={post.date.toISOString()}>{formattedDate}</time>
                            <span className={styles.separator}>•</span>
                            <span>{post.readingTimeMinutes} {minReadText}</span>
                        </div>

                        <h1 className={styles.title}>{post.title}</h1>

                        {post.tags.length > 0 && (
                            <div className={styles.tags}>
                                {post.tags.map((tag) => (
                                    <Link
                                        key={tag.value}
                                        href={`/${locale}/tags/${tag.value}`}
                                        className={styles.tag}
                                    >
                                        {tag.value}
                                    </Link>
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
