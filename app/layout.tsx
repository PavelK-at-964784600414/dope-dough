import type { Metadata } from 'next';
import { Comfortaa } from 'next/font/google';
import './globals.css';

const comfortaa = Comfortaa({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-comfortaa',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'La Petite Sourdough',
  description: 'Step-by-step sourdough bread recipe with intelligent timers and notifications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={comfortaa.variable}>
      <body className={`${comfortaa.className} antialiased`}>{children}</body>
    </html>
  );
}
