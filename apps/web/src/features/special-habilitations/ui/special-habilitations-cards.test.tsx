import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpecialHabilitationsCards } from './special-habilitations-cards';
import { DEFAULT_SPECIAL_HABILITATIONS } from '@/entities/special-habilitation';

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ''} />
  ),
}));

describe('SpecialHabilitationsCards', () => {
  beforeEach(() => {
    vi.stubGlobal('open', vi.fn());
  });

  it("affiche le message d'état vide quand aucune habilitation n'est attribuée", () => {
    render(<SpecialHabilitationsCards habilitations={null} />);
    expect(
      screen.getByText('Aucun titre ou certificat attribué.')
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Titre d'habilitation électrique")
    ).not.toBeInTheDocument();
  });

  it("n'affiche aucun badge Non attribuée quand habilitations est null", () => {
    render(<SpecialHabilitationsCards habilitations={null} />);
    expect(screen.queryAllByText('Non attribuée')).toHaveLength(0);
  });

  it("n'affiche aucun badge Non attribuée avec les valeurs par défaut", () => {
    render(
      <SpecialHabilitationsCards
        habilitations={DEFAULT_SPECIAL_HABILITATIONS}
      />
    );
    expect(screen.queryAllByText('Non attribuée')).toHaveLength(0);
    expect(
      screen.getByText('Aucun titre ou certificat attribué.')
    ).toBeInTheDocument();
  });

  it('affiche "Document disponible" quand une habilitation est activée avec document', () => {
    render(
      <SpecialHabilitationsCards
        habilitations={{
          ...DEFAULT_SPECIAL_HABILITATIONS,
          electricalTitle: true,
          electricalTitleDoc: 'data:image/jpeg;base64,elecBase64',
        }}
      />
    );
    expect(screen.getByText('Document disponible')).toBeInTheDocument();
  });

  it('affiche "Pas de document" quand une habilitation est activée sans document', () => {
    render(
      <SpecialHabilitationsCards
        habilitations={{
          ...DEFAULT_SPECIAL_HABILITATIONS,
          electricalTitle: true,
          electricalTitleDoc: null,
        }}
      />
    );
    expect(screen.getByText('Pas de document')).toBeInTheDocument();
  });

  it('ouvre le document dans un nouvel onglet au clic sur une carte activée avec document', async () => {
    const user = userEvent.setup();
    render(
      <SpecialHabilitationsCards
        habilitations={{
          ...DEFAULT_SPECIAL_HABILITATIONS,
          electricalTitle: true,
          electricalTitleDoc: 'data:image/jpeg;base64,elecBase64',
        }}
      />
    );

    const card = screen.getByRole('button');
    await user.click(card);

    expect(window.open).toHaveBeenCalledWith(
      'data:image/jpeg;base64,elecBase64',
      '_blank'
    );
  });

  it("n'est pas cliquable quand la habilitation est désactivée", () => {
    render(
      <SpecialHabilitationsCards
        habilitations={DEFAULT_SPECIAL_HABILITATIONS}
      />
    );
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it("n'est pas cliquable quand activée mais sans document", () => {
    render(
      <SpecialHabilitationsCards
        habilitations={{
          ...DEFAULT_SPECIAL_HABILITATIONS,
          electricalTitle: true,
          electricalTitleDoc: null,
        }}
      />
    );
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it("n'affiche pas de cartes quand toutes les habilitations sont inactives", () => {
    const { container } = render(
      <SpecialHabilitationsCards habilitations={null} />
    );
    const opacityCards = container.querySelectorAll('.opacity-50');
    expect(opacityCards).toHaveLength(0);
    expect(
      screen.getByText('Aucun titre ou certificat attribué.')
    ).toBeInTheDocument();
  });

  it('affiche uniquement la carte active, sans opacity-50', () => {
    const { container } = render(
      <SpecialHabilitationsCards
        habilitations={{
          ...DEFAULT_SPECIAL_HABILITATIONS,
          electricalTitle: true,
          electricalTitleDoc: 'data:image/jpeg;base64,elecBase64',
        }}
      />
    );
    const opacityCards = container.querySelectorAll('.opacity-50');
    expect(opacityCards).toHaveLength(0);
    expect(screen.getByText('Document disponible')).toBeInTheDocument();
  });

  it('ouvre la carte via la touche Entrée', async () => {
    const user = userEvent.setup();
    render(
      <SpecialHabilitationsCards
        habilitations={{
          ...DEFAULT_SPECIAL_HABILITATIONS,
          sstCertificate: true,
          sstCertificateDoc: 'data:image/pdf;base64,sstDoc',
        }}
      />
    );

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');

    expect(window.open).toHaveBeenCalledWith(
      'data:image/pdf;base64,sstDoc',
      '_blank'
    );
  });
});
