'use client';

import { OfficialDocumentsForm } from '@/features/official-documents';

export default function BtpCardPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Carte Pro du BTP
      </h1>
      <OfficialDocumentsForm documentKeys={['btpCard']} />
    </div>
  );
}
