'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/components/Analytics';

interface ReadingTrackerProps {
    slug: string;
    readingTime: number; // estimated reading time in minutes
}

/**
 * Reading Engagement Tracker
 * 
 * Tracks:
 * - Time spent on article
 * - Scroll depth (%)
 * - Read completion (when scroll > 90%)
 */
export default function ReadingTracker({ slug, readingTime }: ReadingTrackerProps) {
    const startTime = useRef<number>(0);
    const maxScrollDepth = useRef(0);
    const hasTrackedComplete = useRef(false);

    useEffect(() => {
        // Initialize start time on mount to avoid impure function during render
        startTime.current = Date.now();

        // Track scroll depth
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const depth = Math.min(100, Math.round((scrolled / documentHeight) * 100));

            if (depth > maxScrollDepth.current) {
                maxScrollDepth.current = depth;
            }

            // Track read completion when user scrolls past 90%
            if (depth >= 90 && !hasTrackedComplete.current) {
                hasTrackedComplete.current = true;
                const timeSpent = Math.round((Date.now() - startTime.current) / 1000);

                trackEvent('read_complete', {
                    slug,
                    timeSpent,
                    estimatedTime: readingTime * 60,
                });
            }
        };

        // Track time spent when leaving page
        const handleBeforeUnload = () => {
            const timeSpent = Math.round((Date.now() - startTime.current) / 1000);

            trackEvent('reading_session', {
                slug,
                timeSpent,
                scrollDepth: maxScrollDepth.current,
                completed: hasTrackedComplete.current,
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [slug, readingTime]);

    return null; // This component doesn't render anything
}
