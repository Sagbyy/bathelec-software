import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import {
  DEFAULT_FORM_VALUES,
  useDerivationStatusStore,
  type CreateCompletedDerivation,
} from '@/entities/derivation';
import { PhotoAfterStep } from './photo-after-step';

function Harness() {
  const form = useForm<CreateCompletedDerivation>({
    defaultValues: DEFAULT_FORM_VALUES as unknown as CreateCompletedDerivation,
  });
  return (
    <FormProvider {...form}>
      <PhotoAfterStep form={form} />
    </FormProvider>
  );
}

const addPhotoButton = () =>
  screen.queryByRole('button', { name: /Ajouter une photo supplémentaire/ });

describe('PhotoAfterStep', () => {
  beforeEach(() => {
    useDerivationStatusStore.setState({ isNotEditable: false });
  });

  it('allows at most two additional photos (§4.5 step 8)', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(addPhotoButton()!);
    await user.click(addPhotoButton()!);

    expect(screen.getByText('Photo supplémentaire 2 (optionnelle)')).toBeInTheDocument();
    expect(screen.queryByText(/Photo supplémentaire 3/)).not.toBeInTheDocument();
    expect(addPhotoButton()).not.toBeInTheDocument();
  });

  it('only accepts JPEG, PNG and WebP files', () => {
    render(<Harness />);

    expect(screen.getByTestId('photo-after-photo')).toHaveAttribute(
      'accept',
      'image/jpeg,image/png,image/webp'
    );
  });

  it('rejects a file in an unsupported format', async () => {
    render(<Harness />);

    fireEvent.change(screen.getByTestId('photo-after-photo'), {
      target: {
        files: [new File(['gif'], 'photo.gif', { type: 'image/gif' })],
      },
    });

    expect(
      await screen.findByText(
        'La photo doit être au format JPEG, PNG ou WebP et ne pas dépasser 5 Mo'
      )
    ).toBeInTheDocument();
  });
});
