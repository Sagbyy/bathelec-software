'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/entities/user';
import {
  useOfficialDocument,
  useUpsertOfficialDocument,
} from '@/entities/official-document';
import { DocumentUploadCard } from '@/shared/ui/document-upload-card';

export function OfficialDocumentsForm() {
  const user = useUserStore((s) => s.user);
  const userId = user?.id;

  const { data, isLoading } = useOfficialDocument(userId!);
  const { mutate, isPending } = useUpsertOfficialDocument(userId!);

  const [pieceIdentite, setPieceIdentite] = useState<string | null>(null);
  const [carteProBtp, setCarteProBtp] = useState<string | null>(null);
  const [carteMutuelle, setCarteMutuelle] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (data && !initialized.current) {
      setPieceIdentite(data.pieceIdentite ?? null);
      setCarteProBtp(data.carteProBtp ?? null);
      setCarteMutuelle(data.carteMutuelle ?? null);
      initialized.current = true;
    }
  }, [data]);

  const handlePieceIdentiteChange = (value: string | null) => {
    setPieceIdentite(value);
    mutate({ pieceIdentite: value, carteProBtp, carteMutuelle });
  };

  const handleCarteProBtpChange = (value: string | null) => {
    setCarteProBtp(value);
    mutate({ pieceIdentite, carteProBtp: value, carteMutuelle });
  };

  const handleCarteMutuelleChange = (value: string | null) => {
    setCarteMutuelle(value);
    mutate({ pieceIdentite, carteProBtp, carteMutuelle: value });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DocumentUploadCard
        label="Pièce d'identité"
        description="Carte nationale d'identité ou passeport (jpeg, png, webp — max 5 Mo)"
        inputId="piece-identite-upload"
        value={pieceIdentite}
        onChange={handlePieceIdentiteChange}
        isPending={isPending}
      />

      <div className="border-t" />

      <DocumentUploadCard
        label="Carte professionnelle BTP"
        description="Carte BTP en cours de validité (jpeg, png, webp — max 5 Mo)"
        inputId="carte-pro-btp-upload"
        value={carteProBtp}
        onChange={handleCarteProBtpChange}
        isPending={isPending}
      />

      <div className="border-t" />

      <DocumentUploadCard
        label="Carte mutuelle"
        description="Attestation ou carte de mutuelle (jpeg, png, webp — max 5 Mo)"
        inputId="carte-mutuelle-upload"
        value={carteMutuelle}
        onChange={handleCarteMutuelleChange}
        isPending={isPending}
      />
    </div>
  );
}
