import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import StoreInitializer from '../components/StoreInitializer';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RouteGuard from '../components/RouteGuard';
import ToastContainer from '../components/ToastContainer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Velora | Premium Science-Backed Self-Care',
  description: 'Dermatological science meets sensory luxury. Discover high-efficacy active skincare, hair fortifiers, and grooming essentials for men and women.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F5F1EB] text-[#1E1E1E]">
        <StoreInitializer />
        <RouteGuard>
          <Header />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
          <ToastContainer />
        </RouteGuard>
      </body>
    </html>
  );
}
