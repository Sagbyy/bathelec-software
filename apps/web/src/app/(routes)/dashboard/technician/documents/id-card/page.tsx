'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/entities/user';
import {
  useOfficialDocument,
  useUpsertOfficialDocument,
} from '@/entities/official-document';
import { DocumentUploadCard } from '@/shared/ui/document-upload-card';

export default function IdCardPage() {
  const user = useUserStore((s) => s.user);
  const userId = user?.id;

  const { data, isLoading } = useOfficialDocument(userId!);
  const { mutate, isPending } = useUpsertOfficialDocument(userId!);

  const [idCard, setIdCard] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (data && !initialized.current) {
      setIdCard(data.idCard ?? null);
      initialized.current = true;
    }
  }, [data]);

  const handleChange = (value: string | null) => {
    setIdCard(value);
    mutate({ idCard: value, btpCard: data?.btpCard ?? null, mutualCard: data?.mutualCard ?? null });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Pièce d'identité ou titre de séjour
      </h1>

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <DocumentUploadCard
          label="Pièce d'identité ou titre de séjour"
          description="Carte nationale d'identité, passeport ou titre de séjour (jpeg, png, webp — max 5 Mo)"
          inputId="id-card-upload"
          value={idCard}
          onChange={handleChange}
          isPending={isPending}
        />
      )}
    </div>
  );
}
