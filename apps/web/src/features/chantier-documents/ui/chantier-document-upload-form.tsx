'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState, type ChangeEvent } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  CHANTIER_DOCUMENT_TYPE_LABELS,
  CHANTIER_DOCUMENT_TYPE_VALUES,
} from '@repo/types';
import { useCreateChantierDocument } from '@/entities/chantier-document';
import { getApiErrorMessage } from '@/shared/lib/api-error';
import { Button } from '@/shared/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  CHANTIER_DOCUMENT_ACCEPT_ATTRIBUTE,
  chantierDocumentFormSchema,
  ChantierDocumentFormValues,
} from '../model/chantier-document-form.schema';

function stripExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
}

export function ChantierDocumentUploadForm({
  chantierId,
}: Readonly<{ chantierId: number }>) {
  const createDocument = useCreateChantierDocument(chantierId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const form = useForm<ChantierDocumentFormValues>({
    resolver: zodResolver(chantierDocumentFormSchema),
    defaultValues: { name: '', type: undefined, file: '' },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue('file', reader.result as string, { shouldValidate: true });
      if (!form.getValues('name')) {
        form.setValue('name', stripExtension(file.name), {
          shouldValidate: true,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (values: ChantierDocumentFormValues) => {
    createDocument.mutate(values, {
      onSuccess: () => {
        toast.success('Document ajouté avec succès');
        form.reset({ name: '', type: undefined, file: '' });
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onError: (error: Error) => {
        toast.error(getApiErrorMessage(error) || "Échec de l'ajout du document");
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg border p-4"
      >
        <h3 className="font-semibold">Ajouter un document</h3>

        <div className="flex flex-col gap-4 sm:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du document" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CHANTIER_DOCUMENT_TYPE_VALUES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {CHANTIER_DOCUMENT_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="file"
          render={() => (
            <FormItem>
              <FormLabel>Fichier (PDF ou image, 10 Mo maximum)</FormLabel>
              <FormControl>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept={CHANTIER_DOCUMENT_ACCEPT_ATTRIBUTE}
                  onChange={handleFileChange}
                />
              </FormControl>
              {fileName && (
                <p className="text-muted-foreground text-xs">{fileName}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createDocument.isPending}>
          {createDocument.isPending ? 'Ajout...' : 'Ajouter le document'}
        </Button>
      </form>
    </FormProvider>
  );
}
