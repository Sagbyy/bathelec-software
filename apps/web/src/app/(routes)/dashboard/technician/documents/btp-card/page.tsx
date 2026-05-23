'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/entities/user';
import {
  useOfficialDocument,
  useUpsertOfficialDocument,
} from '@/entities/official-document';
import { DocumentUploadCard } from '@/shared/ui/document-upload-card';

export default function BtpCardPage() {
  const user = useUserStore((s) => s.user);
  const userId = user?.id;

  const { data, isLoading } = useOfficialDocument(userId!);
  const { mutate, isPending } = useUpsertOfficialDocument(userId!);

  const [btpCard, setBtpCard] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (data && !initialized.current) {
      setBtpCard(data.btpCard ?? null);
      initialized.current = true;
    }
  }, [data]);

  const handleChange = (value: string | null) => {
    setBtpCard(value);
    mutate({ idCard: data?.idCard ?? null, btpCard: value, mutualCard: data?.mutualCard ?? null });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <Link
        href="/dashboard/technician/documents"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Carte Pro du BTP
      </h1>

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <DocumentUploadCard
          label="Carte professionnelle BTP"
          description="Carte BTP en cours de validité (jpeg, png, webp — max 5 Mo)"
          inputId="btp-card-upload"
          value={btpCard}
          onChange={handleChange}
          isPending={isPending}
        />
      )}
    </div>
  );
}
