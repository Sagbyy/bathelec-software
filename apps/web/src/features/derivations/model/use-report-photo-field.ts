import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { Path, PathValue, UseFormReturn } from 'react-hook-form';
import {
  getReportPhotoFileError,
  type CreateCompletedDerivation,
} from '@/entities/derivation';
import { readFileAsDataUrl } from '../lib/read-file-as-data-url';

type PhotoPath = Path<CreateCompletedDerivation>;

export const useReportPhotoField = (
  form: UseFormReturn<CreateCompletedDerivation>,
  name: PhotoPath
) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const value = form.getValues(name);
    setPreviewUrl(typeof value === 'string' && value ? value : null);
  }, [form, name]);

  const setPhoto = useCallback(
    (value: string | null) => {
      setPreviewUrl(value);
      form.setValue(
        name,
        value as PathValue<CreateCompletedDerivation, PhotoPath>,
        { shouldDirty: true, shouldValidate: true }
      );
    },
    [form, name]
  );

  const selectPhoto = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) {
        return;
      }

      const error = getReportPhotoFileError(file);
      if (error) {
        form.setError(name, { type: 'validate', message: error });
        return;
      }

      setPhoto(await readFileAsDataUrl(file));
    },
    [form, name, setPhoto]
  );

  const clearPhoto = useCallback(() => setPhoto(null), [setPhoto]);

  return { previewUrl, selectPhoto, clearPhoto };
};
