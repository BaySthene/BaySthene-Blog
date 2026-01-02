'use client';

import { useEffect, useState } from 'react';
import styles from './TableOfContents.module.css';
import {useTranslations} from "next-intl";

interface TocHeading {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    contentSelector?: string;
}

export default function TableOfContents({ contentSelector = 'article' }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<TocHeading[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [progress, setProgress] = useState(0);
    const t = useTranslations('blog');

    // Extract headings from content
    useEffect(() => {
        const extractHeadings = () => {
            const content = document.querySelector(contentSelector);
            if (!content) return;

            const elements = content.querySelectorAll('h2, h3');
            const tocHeadings: TocHeading[] = [];

            elements.forEach((el) => {
                if (el.id) {
                    tocHeadings.push({
                        id: el.id,
                        text: el.textContent?.replace(/^#\s*/, '') || '',
                        level: parseInt(el.tagName[1]),
                    });
                }
            });

            setHeadings(tocHeadings);
        };

        // Wait for DOM to be ready
        const timer = setTimeout(extractHeadings, 100);
        return () => clearTimeout(timer);
    }, [contentSelector]);

    // Track active heading on scroll and calculate progress
    useEffect(() => {
        if (headings.length === 0) return;

        const handleScroll = () => {
            // Calculate scroll progress
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                setProgress((scrollTop / docHeight) * 100);
            }

            // Find active heading
            const headingElements = headings.map(({ id }) => document.getElementById(id)).filter(Boolean);

            for (let i = headingElements.length - 1; i >= 0; i--) {
                const element = headingElements[i];
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150) {
                        setActiveId(headings[i].id);
                        return;
                    }
                }
            }

            // If no heading is past threshold, activate first one if scrolled
            if (scrollTop > 100 && headings.length > 0) {
                setActiveId(headings[0].id);
            } else if (scrollTop <= 100) {
                setActiveId('');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [headings]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });

            history.pushState(null, '', `#${id}`);
        }
    };

    if (headings.length === 0) {
        return null;
    }

    return (
        <nav className={styles.toc} aria-label={t('tableOfContents')}>
            <div className={styles.tocInner}>
                <div className={styles.header}>
                    <div className={styles.headerIcon}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className={styles.title}>{t('tableOfContents')}</h4>
                        <span className={styles.subtitle}>{headings.length} {t('tableOfContentsSubtitle')}</span>
                    </div>
                </div>

                <ul className={styles.list}>
                    {headings.map((heading) => (
                        <li
                            key={heading.id}
                            className={`${styles.item} ${heading.level === 3 ? styles.nested : ''}`}
                        >
                            <a
                                href={`#${heading.id}`}
                                onClick={(e) => handleClick(e, heading.id)}
                                className={`${styles.link} ${activeId === heading.id ? styles.active : ''}`}
                            >
                                <span className={styles.linkIndicator} />
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className={styles.progress}>
                    <span className={styles.progressLabel}>{t('tableOfContentsProgress')}</span>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
