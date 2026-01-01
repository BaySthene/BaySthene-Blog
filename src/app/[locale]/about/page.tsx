import { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import styles from './page.module.css';
import { GitHubIcon, LinkedInIcon, TwitterIcon } from '@/components/Icons';

export const metadata: Metadata = {
    title: 'Hakkımda',
    description: 'BaySthene Blog yazarı hakkında bilgi',
};

export default function AboutPage() {
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <div className={styles.avatarWrapper}>
                    <div className={styles.avatarGlow}></div>
                    <div className={styles.avatar}>
                        <span className={styles.avatarText}>MU</span>
                    </div>
                </div>

                <h1 className={styles.name}>{siteConfig.author.name}</h1>
                <p className={styles.role}>Yazılım Geliştirici & Blog Yazarı</p>
            </div>

            <div className={styles.content}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{siteConfig.about.title}</h2>
                    <p className={styles.text}>
                        {siteConfig.about.description}
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Uzmanlık Alanlarım</h2>
                    <div className={styles.skills}>
                        {siteConfig.skills.map((skill) => (
                            <span key={skill} className={styles.skill}>{skill}</span>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>İletişim</h2>
                    <div className={styles.links}>
                        {siteConfig.author.links.github && (
                            <a
                                href={siteConfig.author.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                            >
                                <GitHubIcon size={24} />
                                GitHub
                            </a>
                        )}
                        {siteConfig.author.links.twitter && (
                            <a
                                href={siteConfig.author.links.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                            >
                                <TwitterIcon size={24} />
                                Twitter
                            </a>
                        )}
                        {siteConfig.author.links.linkedin && (
                            <a
                                href={siteConfig.author.links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                            >
                                <LinkedInIcon size={24} />
                                LinkedIn
                            </a>
                        )}
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Blog Hakkında</h2>
                    <p className={styles.text}>
                        Bu blog Next.js 15, TypeScript ve Material Design 3 ile geliştirilmiştir.
                        Performans, erişilebilirlik ve modern tasarım ilkelerine önem verilmiştir.
                    </p>
                    <div className={styles.techStack}>
                        <span className={styles.tech}>Next.js 15</span>
                        <span className={styles.tech}>TypeScript</span>
                        <span className={styles.tech}>Material Design 3</span>
                        <span className={styles.tech}>CSS Modules</span>
                    </div>
                </section>
            </div>

            <div className={styles.cta}>
                <Link href="/" className={styles.ctaButton}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                    Yazılara Göz At
                </Link>
            </div>
        </div>
    );
}
