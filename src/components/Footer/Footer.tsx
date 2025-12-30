import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import { GitHubIcon, LinkedInIcon } from '@/components/Icons';
import styles from './Footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand */}
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoIcon}>📝</span>
                            <span className={styles.logoText}>BaySthene</span>
                        </Link>
                        <p className={styles.description}>
                            {siteConfig.description}
                        </p>
                    </div>

                    {/* Links */}
                    <div className={styles.links}>
                        <h4 className={styles.linksTitle}>Bağlantılar</h4>
                        <nav className={styles.linksNav}>
                            <Link href="/">Ana Sayfa</Link>
                            <Link href="/search">Tüm Yazılar</Link>
                            <Link href="/tags">Etiketler</Link>
                            <Link href="/about">Hakkımda</Link>
                        </nav>
                    </div>

                    {/* Social */}
                    <div className={styles.social}>
                        <h4 className={styles.socialTitle}>Sosyal</h4>
                        <div className={styles.socialLinks}>
                            <a
                                href={siteConfig.author.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className={styles.socialLink}
                            >
                                <GitHubIcon size={20} />
                            </a>
                            <a
                                href={siteConfig.author.links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className={styles.socialLink}
                            >
                                <LinkedInIcon size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {currentYear} {siteConfig.author.name}. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        </footer>
    );
}
