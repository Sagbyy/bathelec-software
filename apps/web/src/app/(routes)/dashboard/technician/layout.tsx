'use client';

import { ReactNode } from 'react';
import { ArrowLeft, House } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TechnicianLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex h-14 shrink-0 items-center justify-end gap-2 border-b bg-white px-4 md:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Link
          href="/dashboard"
          className="flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="Accueil"
        >
          <House className="h-5 w-5" />
        </Link>
      </div>
      {children}
    </div>
  );
}
