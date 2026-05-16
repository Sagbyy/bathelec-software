import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TechnicianHome } from './technician-home';

const mockUseUserStore = vi.hoisted(() => vi.fn());

vi.mock('@/entities/user', () => ({
  useUserStore: mockUseUserStore,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/dashboard',
}));

describe('TechnicianHome', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUserStore.mockReturnValue({
      user: { id: 1, username: 'jean.dupont', role: 'technician' },
    });
  });

  describe('rendu général', () => {
    it('affiche exactement 7 cartes de navigation', () => {
      render(<TechnicianHome />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(7);
    });

    it('affiche les 7 labels de section', () => {
      render(<TechnicianHome />);

      expect(screen.getByText('Top Chantiers')).toBeInTheDocument();
      expect(screen.getByText('Chantiers en cours')).toBeInTheDocument();
      expect(screen.getByText('Chantiers terminés')).toBeInTheDocument();
      expect(screen.getByText('Mes documents officiels')).toBeInTheDocument();
      expect(screen.getByText('Mes habilitations')).toBeInTheDocument();
      expect(screen.getByText('Mon véhicule')).toBeInTheDocument();
      expect(screen.getByText("Numéros d'urgence")).toBeInTheDocument();
    });

    it('affiche le titre et le sous-titre de la page', () => {
      render(<TechnicianHome />);

      expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
      expect(screen.getByText('Que souhaitez-vous faire ?')).toBeInTheDocument();
    });
  });

  describe('salutation utilisateur', () => {
    it("affiche le username dans la salutation", () => {
      render(<TechnicianHome />);

      expect(screen.getByText(/jean\.dupont/)).toBeInTheDocument();
    });

    it('affiche "Technicien" quand user est undefined', () => {
      mockUseUserStore.mockReturnValue({ user: undefined });

      render(<TechnicianHome />);

      expect(screen.getByText(/Technicien/)).toBeInTheDocument();
    });

    it('affiche "Technicien" quand le store retourne null', () => {
      mockUseUserStore.mockReturnValue({ user: null });

      render(<TechnicianHome />);

      expect(screen.getByText(/Technicien/)).toBeInTheDocument();
    });
  });

  describe('liens de navigation', () => {
    it('la carte Top Chantiers pointe vers la bonne route', () => {
      render(<TechnicianHome />);

      const link = screen.getByRole('link', { name: /top chantiers/i });
      expect(link).toHaveAttribute('href', '/dashboard/technician/top-chantiers');
    });

    it('la carte Chantiers en cours pointe vers la bonne route', () => {
      render(<TechnicianHome />);

      const link = screen.getByRole('link', { name: /chantiers en cours/i });
      expect(link).toHaveAttribute('href', '/dashboard/technician/derivations');
    });

    it('la carte Chantiers terminés pointe vers la bonne route', () => {
      render(<TechnicianHome />);

      const link = screen.getByRole('link', { name: /chantiers terminés/i });
      expect(link).toHaveAttribute(
        'href',
        '/dashboard/technician/derivations/complete'
      );
    });

    it('la carte Documents officiels pointe vers la bonne route', () => {
      render(<TechnicianHome />);

      const link = screen.getByRole('link', { name: /documents officiels/i });
      expect(link).toHaveAttribute('href', '/dashboard/technician/documents');
    });

    it('la carte Habilitations pointe vers la bonne route', () => {
      render(<TechnicianHome />);

      const link = screen.getByRole('link', { name: /habilitations/i });
      expect(link).toHaveAttribute('href', '/dashboard/technician/habilitations');
    });

    it('la carte Véhicule pointe vers la bonne route', () => {
      render(<TechnicianHome />);

      const link = screen.getByRole('link', { name: /véhicule/i });
      expect(link).toHaveAttribute('href', '/dashboard/technician/vehicule');
    });

    it("la carte Urgences pointe vers la bonne route", () => {
      render(<TechnicianHome />);

      const link = screen.getByRole('link', { name: /urgence/i });
      expect(link).toHaveAttribute('href', '/dashboard/technician/urgences');
    });
  });

  describe('accessibilité', () => {
    it('toutes les cartes sont des liens accessibles', () => {
      render(<TechnicianHome />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).not.toBe('');
      });
    });
  });
});
