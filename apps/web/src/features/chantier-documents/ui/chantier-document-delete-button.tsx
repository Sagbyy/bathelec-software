'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ChantierDocument } from '@repo/types';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useDeleteChantierDocument } from '@/entities/chantier-document';
import { getApiErrorMessage } from '@/shared/lib/api-error';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

export function ChantierDocumentDeleteButton({
  chantierId,
  documentItem,
}: Readonly<{ chantierId: number; documentItem: ChantierDocument }>) {
  const [open, setOpen] = useState(false);
  const deleteDocument = useDeleteChantierDocument(chantierId);

  const onConfirm = () => {
    deleteDocument.mutate(documentItem._id, {
      onSuccess: () => {
        toast.success('Document supprimé');
        setOpen(false);
      },
      onError: (error: Error) => {
        toast.error(getApiErrorMessage(error) || 'Échec de la suppression');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Supprimer">
          <Icon icon="mdi:trash" className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer ce document ?</DialogTitle>
          <DialogDescription>
            Cette action est définitive. Le document « {documentItem.name} »
            sera supprimé.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={deleteDocument.isPending}
          >
            {deleteDocument.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
