import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'Kingston Chicken - Fresh Chicken. Quality You Can Taste.',
  description: 'We supply the freshest, high-quality chicken cuts at the best prices. Perfect for your family.',
  keywords: 'chicken, fresh chicken, Nairobi, Kenya, meat delivery',
  openGraph: {
    title: 'Kingston Chicken - Fresh Chicken. Quality You Can Taste.',
    description: 'We supply the freshest, high-quality chicken cuts at the best prices.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
