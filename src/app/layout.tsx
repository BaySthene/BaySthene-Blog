import type { Metadata } from 'next';
import '@/styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Analytics from '@/components/Analytics';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: 'BaySthene Blog',
    template: '%s | BaySthene Blog',
  },
  description: 'Yazılım, teknoloji ve daha fazlası hakkında düşüncelerimi paylaştığım kişisel blog.',
  keywords: ['blog', 'yazılım', 'teknoloji', 'geliştirici', 'programlama'],
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
    locale: 'tr_TR',
    siteName: 'BaySthene Blog',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}
