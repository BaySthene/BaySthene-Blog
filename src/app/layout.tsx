import type { Metadata } from 'next';
import '@/styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'BaySthene Blog',
    template: '%s | BaySthene Blog',
  },
  description: 'Yazılım, teknoloji ve daha fazlası hakkında düşüncelerimi paylaştığım kişisel blog.',
  keywords: ['blog', 'yazılım', 'teknoloji', 'geliştirici', 'programlama'],
  authors: [{ name: 'BaySthene' }],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'BaySthene Blog',
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
      </body>
    </html>
  );
}
