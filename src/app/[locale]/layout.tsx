import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Analytics from '@/components/Analytics';
import { locales, type Locale } from '@/i18n/config';

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

// Helper to validate locale
function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale: localeParam } = await params;

    // Validate and cast
    if (!isValidLocale(localeParam)) {
        notFound();
    }
    const locale = localeParam;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return {
        metadataBase: new URL(siteUrl),
        title: {
            default: 'BaySthene Blog',
            template: '%s | BaySthene Blog',
        },
        description: locale === 'tr'
            ? 'Yazılım, teknoloji ve daha fazlası hakkında düşüncelerimi paylaştığım kişisel blog.'
            : 'A personal blog where I share my thoughts on software, technology and more.',
        keywords: locale === 'tr'
            ? ['blog', 'yazılım', 'teknoloji', 'geliştirici', 'programlama']
            : ['blog', 'software', 'technology', 'developer', 'programming'],
        authors: [{ name: 'BaySthene' }],
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
        openGraph: {
            type: 'website',
            locale: locale === 'tr' ? 'tr_TR' : 'en_US',
            siteName: 'BaySthene Blog',
        },
        alternates: {
            canonical: `/${locale}`,
            languages: {
                'tr': '/tr',
                'en': '/en',
            },
        },
        icons: {
            icon: [
                { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
                { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            ],
            apple: '/icons/apple-touch-icon.png',
        },
        manifest: '/icons/site.webmanifest',
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale: localeParam } = await params;

    // Validate that the incoming `locale` parameter is valid
    if (!isValidLocale(localeParam)) {
        notFound();
    }
    const locale = localeParam;

    // Enable static rendering
    setRequestLocale(locale);

    // Get messages for the locale
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider>
                        <Header locale={locale} />
                        <main>{children}</main>
                        <Footer locale={locale} />
                        <BackToTop />
                        <Analytics />
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

