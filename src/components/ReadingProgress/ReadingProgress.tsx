'use client';

import { useEffect, useState } from 'react';
import styles from './ReadingProgress.module.css';
import {useTranslations} from "next-intl";

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);
    const t = useTranslations('blog');

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (docHeight > 0) {
                const scrollPercent = (scrollTop / docHeight) * 100;
                setProgress(Math.min(100, Math.max(0, scrollPercent)));
            }
        };

        // Initial calculation
        updateProgress();

        // Listen to scroll events
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });

        return () => {
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
        };
    }, []);

    // Don't render if no progress yet (prevents hydration mismatch)
    if (progress === 0) {
        return <div className={styles.container} aria-hidden="true" />;
    }

    return (
        <div
            className={styles.container}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('tableOfContentsReadingProgress')}
        >
            <div
                className={styles.bar}
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
