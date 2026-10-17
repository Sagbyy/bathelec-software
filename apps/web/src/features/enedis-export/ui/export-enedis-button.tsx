'use client';

import { useMutation } from '@tanstack/react-query';
import { FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { Button } from '@/shared/ui/button';
import {
  EnedisExportScope,
  enedisExportService,
} from '../api/enedis-export.service';
import { saveFile } from '../lib/save-file';

interface ExportEnedisButtonProps {
  scope: EnedisExportScope;
  id: number;
  label?: string;
}

const errorMessage = (error: Error) =>
  isAxiosError(error) && error.response?.status === 404
    ? 'Aucun relevé complété à exporter.'
    : "L'export Enedis a échoué.";

export function ExportEnedisButton({
  scope,
  id,
  label = 'Exporter (Excel Enedis)',
}: ExportEnedisButtonProps) {
  const exportMutation = useMutation({
    mutationFn: () => enedisExportService.download(scope, id),
    onSuccess: ({ blob, fileName }) => saveFile(blob, fileName),
    onError: (error: Error) => toast.error(errorMessage(error)),
  });

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => exportMutation.mutate()}
      disabled={exportMutation.isPending}
      className="gap-2"
    >
      <FileSpreadsheet className="h-4 w-4" />
      {exportMutation.isPending ? 'Export en cours...' : label}
    </Button>
  );
}
