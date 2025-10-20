import type { Metadata } from 'next';
import { Inter, Fredoka } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fredoka = Fredoka({ 
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Dope Dough',
  description: 'Step-by-step sourdough bread recipe with intelligent timers and notifications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fredoka.variable}`}>
      <body className={`${inter.className} font-body antialiased`}>{children}</body>
    </html>
  );
}
