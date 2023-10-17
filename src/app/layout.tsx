import { Raleway, Lobster } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';
import type { Metadata } from 'next';

const raleway = Raleway({
  style: 'normal',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-raleway',
});

const lobster = Lobster({
  style: 'normal',
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-lobster',
});

export const metadata: Metadata = {
  title: 'Qualk | Greet, Gather, and Gossip.',
  description:
    'Best way to chat on the web by just logging in with your Gmail account.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${raleway.variable} ${lobster.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
