'use client';

import { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { cn } from '@/shared/lib/utils';
import { Button } from './button';

interface SignaturePadProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  clearLabel?: string;
}

export function SignaturePad({
  value,
  onChange,
  disabled = false,
  clearLabel = 'Effacer la signature',
}: SignaturePadProps) {
  const signatureRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    if (value) signatureRef.current?.fromDataURL(value);
  }, []);

  const clear = () => {
    signatureRef.current?.clear();
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'h-64 rounded-md border bg-white p-2',
          disabled && 'pointer-events-none cursor-not-allowed'
        )}
      >
        <SignatureCanvas
          ref={signatureRef}
          penColor="black"
          canvasProps={{ className: 'w-full h-full' }}
          onEnd={() =>
            onChange(
              signatureRef.current?.getTrimmedCanvas().toDataURL('image/png') ??
                null
            )
          }
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={clear}
        className="flex items-center"
        disabled={disabled}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {clearLabel}
      </Button>
    </div>
  );
}
