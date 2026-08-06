import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GST 212 Practice Portal | Unique Questions Bank',
  description: 'Practice 112 unique questions extracted and deduplicated from GST 212 course materials with interactive options and instant answer lookup.',
  keywords: ['GST 212', 'UNILAG', 'Philosophy', 'Practice Bank', 'Unique Questions'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col custom-scrollbar">
        {children}
      </body>
    </html>
  );
}
