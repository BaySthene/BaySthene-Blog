'use client';

import Script from 'next/script';

interface AnalyticsProps {
    websiteId?: string;
    src?: string;
}

/**
 * Umami Analytics Component
 * 
 * Kullanım:
 * 1. umami.is'de hesap oluştur veya self-host et
 * 2. Website ekle ve ID'yi kopyala
 * 3. .env.local'a NEXT_PUBLIC_UMAMI_WEBSITE_ID ekle
 * 
 * Özellikler:
 * - Cookie-free tracking (GDPR uyumlu)
 * - Otomatik sayfa görüntüleme
 * - Custom event tracking (umami.track())
 */
export default function Analytics({
    websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    src = process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://cloud.umami.is/script.js'
}: AnalyticsProps) {
    // Analytics ID yoksa hiçbir şey render etme
    if (!websiteId) {
        return null;
    }

    return (
        <Script
            src={src}
            data-website-id={websiteId}
            strategy="lazyOnload"
            data-domains={process.env.NEXT_PUBLIC_SITE_DOMAIN || ''}
        />
    );
}

// Type definitions for Umami tracking
declare global {
    interface Window {
        umami?: {
            track: (eventName: string, eventData?: Record<string, unknown>) => void;
        };
    }
}

/**
 * Custom event tracking helper
 * 
 * Kullanım:
 * trackEvent('share_click', { platform: 'twitter', slug: 'react-hooks' });
 * trackEvent('read_complete', { slug: 'react-hooks', timeSpent: 120 });
 */
export function trackEvent(eventName: string, eventData?: Record<string, unknown>) {
    if (typeof window !== 'undefined' && window.umami) {
        window.umami.track(eventName, eventData);
    }
}
