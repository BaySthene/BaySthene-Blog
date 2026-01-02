import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import FeaturedPost from '@/components/FeaturedPost';
import BlogCard from '@/components/BlogCard';
import ProfileCard from '@/components/ProfileCard';
import { ArrowDownIcon } from '@/components/Icons';
import { ServiceFactory } from '@/application/factories';
import { toPostViewModel } from '@/presentation/types';
import { siteConfig } from '@/lib/config';
import { type Locale } from '@/i18n/config';
import styles from './page.module.css';

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('home');

  const { getAllPosts } = ServiceFactory.getBlogServices();
  const allPosts = await getAllPosts.execute();

  // Transform domain posts to presentation view models
  const posts = allPosts.map(toPostViewModel);
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const recentPosts = posts.slice(1, 4);

  return (
    <div className={styles.container}>
      {/* SEO: Hidden but accessible H1 */}
      <h1 className={styles.srOnly}>
        {t('seoTitle')}
      </h1>

      <div className={styles.layout}>
        <div className={styles.main}>
          {/* Featured Post */}
          {featuredPost ? (
            <section className={styles.featuredSection}>
              <FeaturedPost post={featuredPost} locale={locale} />
            </section>
          ) : (
            <section className={styles.emptyState}>
              <h2>{t('noPosts')}</h2>
              <p>{t('comingSoon')}</p>
            </section>
          )}

          {/* Recent Posts */}
          {recentPosts.length > 0 && (
            <section className={styles.recentSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t('recentPosts')}</h2>
                <Link href={`/${locale}/search`} className={styles.viewAllLink}>
                  {t('viewAll')}
                  <ArrowDownIcon size={18} />
                </Link>
              </div>
              <div className={styles.postsGrid}>
                {recentPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <ProfileCard author={siteConfig.author} locale={locale} />
        </aside>
      </div>
    </div>
  );
}
