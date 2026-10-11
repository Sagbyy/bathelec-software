'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/entities/user';
import {
  useOfficialDocument,
  useUpsertOfficialDocument,
  useUpdateOfficialDocumentByUser,
} from '@/entities/official-document';
import { DocumentUploadCard } from '@/shared/ui/document-upload-card';

interface OfficialDocumentsFormProps {
  userId?: number;
}

export function OfficialDocumentsForm({ userId }: OfficialDocumentsFormProps = {}) {
  const currentUser = useUserStore((s) => s.user);
  const managed = userId != null;
  const targetUserId = userId ?? currentUser?.id;

  const { data, isLoading } = useOfficialDocument(targetUserId!);
  const selfUpsert = useUpsertOfficialDocument(targetUserId!);
  const managedUpdate = useUpdateOfficialDocumentByUser(targetUserId!);
  const { mutate, isPending } = managed ? managedUpdate : selfUpsert;

  const [idCard, setIdCard] = useState<string | null>(null);
  const [btpCard, setBtpCard] = useState<string | null>(null);
  const [mutualCard, setMutualCard] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (data && !initialized.current) {
      setIdCard(data.idCard ?? null);
      setBtpCard(data.btpCard ?? null);
      setMutualCard(data.mutualCard ?? null);
      initialized.current = true;
    }
  }, [data]);

  const handleIdCardChange = (value: string | null) => {
    setIdCard(value);
    mutate({ idCard: value, btpCard, mutualCard });
  };

  const handleBtpCardChange = (value: string | null) => {
    setBtpCard(value);
    mutate({ idCard, btpCard: value, mutualCard });
  };

  const handleMutualCardChange = (value: string | null) => {
    setMutualCard(value);
    mutate({ idCard, btpCard, mutualCard: value });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (managed && !data) {
    return (
      <p className="text-muted-foreground text-sm">
        Ce technicien n&apos;a pas encore enregistré de documents officiels.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <DocumentUploadCard
        label="Pièce d'identité ou titre de séjour"
        description="Carte nationale d'identité, passeport ou titre de séjour (jpeg, png, webp — max 5 Mo)"
        inputId="id-card-upload"
        value={idCard}
        onChange={handleIdCardChange}
        isPending={isPending}
      />

      <div className="border-t" />

      <DocumentUploadCard
        label="Carte professionnelle BTP"
        description="Carte BTP en cours de validité (jpeg, png, webp — max 5 Mo)"
        inputId="btp-card-upload"
        value={btpCard}
        onChange={handleBtpCardChange}
        isPending={isPending}
      />

      <div className="border-t" />

      <DocumentUploadCard
        label="Carte mutuelle"
        description="Attestation ou carte de mutuelle (jpeg, png, webp — max 5 Mo)"
        inputId="mutual-card-upload"
        value={mutualCard}
        onChange={handleMutualCardChange}
        isPending={isPending}
      />
    </div>
  );
}
