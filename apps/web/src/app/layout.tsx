import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/contexts/query-provider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Abrisûr software',
  description: 'Dashboard Abrisûr software',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <QueryProvider>
          <main>{children}</main>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
