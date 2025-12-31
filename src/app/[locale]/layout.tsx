import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Analytics from '@/components/Analytics';
import { siteConfig } from '@/lib/config';
import { locales, type Locale } from '@/i18n/config';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
    const { locale } = await params;

    return {
        metadataBase: new URL(siteConfig.siteUrl),
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
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;

    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Get messages for the locale
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <Header locale={locale} />
                    <main>{children}</main>
                    <Footer locale={locale} />
                    <BackToTop />
                    <Analytics />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
