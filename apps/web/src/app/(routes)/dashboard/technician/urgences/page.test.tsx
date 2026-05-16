import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UrgencesPage from './page';

describe('UrgencesPage', () => {
  describe('rendu', () => {
    it('affiche le titre de la page', () => {
      render(<UrgencesPage />);

      expect(
        screen.getByRole('heading', { name: "Numéros d'urgence" })
      ).toBeInTheDocument();
    });

    it('affiche le sous-titre', () => {
      render(<UrgencesPage />);

      expect(
        screen.getByText("Contacts essentiels en cas d'urgence")
      ).toBeInTheDocument();
    });

    it('affiche 5 contacts d\'urgence', () => {
      render(<UrgencesPage />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(5);
    });
  });

  describe('contacts', () => {
    it('affiche le SAMU avec le numéro 15', () => {
      render(<UrgencesPage />);

      expect(screen.getByText('SAMU')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('affiche la Police avec le numéro 17', () => {
      render(<UrgencesPage />);

      expect(screen.getByText('Police / Gendarmerie')).toBeInTheDocument();
      expect(screen.getByText('17')).toBeInTheDocument();
    });

    it('affiche les Pompiers avec le numéro 18', () => {
      render(<UrgencesPage />);

      expect(screen.getByText('Pompiers')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
    });

    it('affiche le numéro européen 112', () => {
      render(<UrgencesPage />);

      expect(screen.getByText('Numéro européen')).toBeInTheDocument();
      expect(screen.getByText('112')).toBeInTheDocument();
    });

    it('affiche EDF Urgences avec le numéro 3946', () => {
      render(<UrgencesPage />);

      expect(screen.getByText('EDF — Urgences réseau')).toBeInTheDocument();
      expect(screen.getByText('3946')).toBeInTheDocument();
    });
  });

  describe('liens téléphoniques', () => {
    it('le lien SAMU a un href tel:15', () => {
      render(<UrgencesPage />);

      const link = screen.getByRole('link', { name: /samu/i });
      expect(link).toHaveAttribute('href', 'tel:15');
    });

    it('le lien Police a un href tel:17', () => {
      render(<UrgencesPage />);

      const link = screen.getByRole('link', { name: /police/i });
      expect(link).toHaveAttribute('href', 'tel:17');
    });

    it('le lien Pompiers a un href tel:18', () => {
      render(<UrgencesPage />);

      const link = screen.getByRole('link', { name: /pompiers/i });
      expect(link).toHaveAttribute('href', 'tel:18');
    });

    it('le lien européen a un href tel:112', () => {
      render(<UrgencesPage />);

      const link = screen.getByRole('link', { name: /européen/i });
      expect(link).toHaveAttribute('href', 'tel:112');
    });

    it('le lien EDF a un href tel:3946', () => {
      render(<UrgencesPage />);

      const link = screen.getByRole('link', { name: /edf/i });
      expect(link).toHaveAttribute('href', 'tel:3946');
    });

    it('tous les liens ont un attribut href valide commençant par tel:', () => {
      render(<UrgencesPage />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link.getAttribute('href')).toMatch(/^tel:\d+$/);
      });
    });
  });

  describe('descriptions', () => {
    it('affiche la description du SAMU', () => {
      render(<UrgencesPage />);

      expect(screen.getByText('Urgences médicales')).toBeInTheDocument();
    });

    it('affiche la description des Pompiers', () => {
      render(<UrgencesPage />);

      expect(screen.getByText('Incendie & secours')).toBeInTheDocument();
    });

    it('affiche la description EDF', () => {
      render(<UrgencesPage />);

      expect(
        screen.getByText('Incidents réseau électrique')
      ).toBeInTheDocument();
    });
  });
});
