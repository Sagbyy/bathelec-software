import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import QueryProvider from '@/shared/config/query-provider';
import AuthProvider from '@/shared/config/auth-provider';
import ThemeProvider from '@/shared/config/theme-provider';
import ServiceWorkerRegistrar from '@/shared/config/service-worker-registrar';
import { Toaster } from '@/shared/ui/sonner';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
});

const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Abrisûr',
    template: '%s · Abrisûr',
  },
  description: 'Plateforme de gestion des chantiers Abrisûr',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh">
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <main>{children}</main>
            </AuthProvider>
          </QueryProvider>
          <ServiceWorkerRegistrar />
          <Toaster richColors closeButton position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
