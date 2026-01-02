'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpIcon } from '@/components/Icons';
import styles from './BackToTop.module.css';

interface BackToTopProps {
    threshold?: number;
}

export default function BackToTop({ threshold = 400 }: BackToTopProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const t = useTranslations('common');

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;

            // Show/hide button
            setIsVisible(scrollTop > threshold);

            // Calculate progress
            if (docHeight > 0) {
                setScrollProgress((scrollTop / docHeight) * 100);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            className={`${styles.button} ${isVisible ? styles.visible : ''}`}
            onClick={scrollToTop}
            aria-label={t('backToTop')}
            title={t('backToTop')}
        >
            {/* Progress ring */}
            <svg className={styles.progressRing} viewBox="0 0 48 48">
                <circle
                    className={styles.progressBg}
                    cx="24"
                    cy="24"
                    r="20"
                    strokeWidth="3"
                    fill="none"
                />
                <circle
                    className={styles.progressFill}
                    cx="24"
                    cy="24"
                    r="20"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - scrollProgress / 100)}`}
                />
            </svg>

            <ArrowUpIcon size={24} className={styles.icon} />
        </button>
    );
}
