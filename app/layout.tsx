import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Samansa',
  description: 'Discover and watch great films',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-gray-100`}
      >
        <Providers>
          <header className="sticky top-0 z-50 border-b border-gray-800 bg-background/90 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl items-center px-4 py-4">
              <Link
                href="/"
                className="text-xl font-bold tracking-tight text-accent hover:text-accent/80 transition-colors"
              >
                Samansa
              </Link>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
