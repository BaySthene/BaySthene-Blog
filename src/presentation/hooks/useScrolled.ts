'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook to track scroll state
 * Returns true when page is scrolled past threshold
 */
export function useScrolled(threshold = 20): boolean {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > threshold);
        };

        // Check initial scroll position
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return isScrolled;
}
