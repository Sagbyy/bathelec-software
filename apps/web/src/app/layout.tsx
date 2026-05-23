import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/shared/config/query-provider';
import AuthProvider from '@/shared/config/auth-provider';
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
          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
