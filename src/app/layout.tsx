import '@/styles/globals.css';

// Root layout that passes through to locale or redirect pages
// The actual html/body tags are in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
