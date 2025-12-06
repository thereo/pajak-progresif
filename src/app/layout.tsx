import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import DarkModeToggle from '@/components/dark-mode-toggle';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
});

export const metadata: Metadata = {
  title: 'Kalkulator Pajak Motor Jakarta',
  description: 'Hitung pajak motor DKI Jakarta dengan mudah dan akurat',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={poppins.className}>
        <div className="min-h-screen bg-background text-foreground">
          <DarkModeToggle />
          {children}
        </div>
      </body>
    </html>
  );
}
