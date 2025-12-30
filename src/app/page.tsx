import Link from 'next/link';
import FeaturedPost from '@/components/FeaturedPost';
import BlogCard from '@/components/BlogCard';
import ProfileCard from '@/components/ProfileCard';
import { ArrowDownIcon } from '@/components/Icons';
import { getFeaturedPost, getRecentPosts } from '@/lib/markdown';
import { siteConfig } from '@/lib/config';
import styles from './page.module.css';

export default function HomePage() {
  const featuredPost = getFeaturedPost();
  const recentPosts = getRecentPosts(3);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.main}>
          {/* Featured Post */}
          {featuredPost ? (
            <section className={styles.featuredSection}>
              <FeaturedPost post={featuredPost} />
            </section>
          ) : (
            <section className={styles.emptyState}>
              <h2>Henüz blog yazısı yok</h2>
              <p>Yakında içerikler eklenecek!</p>
            </section>
          )}

          {/* Recent Posts */}
          {recentPosts.length > 0 && (
            <section className={styles.recentSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Diğer Yazılar</h2>
                <Link href="/search" className={styles.viewAllLink}>
                  Tüm Yazıları Gör
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
          <ProfileCard author={siteConfig.author} />
        </aside>
      </div>
    </div>
  );
}
