'use client';

import type React from 'react';
import { useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface DocumentUploadCardProps {
  label: string;
  description: string;
  inputId: string;
  value: string | null;
  onChange: (base64: string | null) => void;
  isPending?: boolean;
}

export function DocumentUploadCard({
  label,
  description,
  inputId,
  value,
  onChange,
  isPending = false,
}: DocumentUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);

    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>

      {value ? (
        <div className="relative h-52 w-full max-w-md overflow-hidden rounded-md border">
          <Zoom>
            <Image
              src={value}
              alt={`Aperçu ${label}`}
              fill
              className="object-contain"
            />
          </Zoom>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 z-10"
            onClick={() => onChange(null)}
            disabled={isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-md rounded-md border-2 border-dashed border-gray-300 p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-600">
              Cliquez ou glissez-déposez un document
            </p>
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={isPending}
            >
              Sélectionner un fichier
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
