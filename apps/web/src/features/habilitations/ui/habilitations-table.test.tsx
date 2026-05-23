import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HabilitationsTable } from './habilitations-table';
import { DEFAULT_HABILITATIONS, HabilitationCodes } from '@/entities/habilitation';

const allEnabled: HabilitationCodes = Object.fromEntries(
  Object.keys(DEFAULT_HABILITATIONS).map((k) => [k, true])
) as unknown as HabilitationCodes;

describe('HabilitationsTable', () => {
  describe('légende', () => {
    it('affiche le label "Activée"', () => {
      render(<HabilitationsTable habilitations={null} />);
      expect(screen.getByText('Activée')).toBeInTheDocument();
    });

    it('affiche le label "Non activée"', () => {
      render(<HabilitationsTable habilitations={null} />);
      expect(screen.getByText('Non activée')).toBeInTheDocument();
    });
  });

  describe('badges désactivés (habilitations null)', () => {
    it('utilise DEFAULT_HABILITATIONS quand habilitations est null', () => {
      render(<HabilitationsTable habilitations={null} />);
      const badges = document.querySelectorAll('span.line-through');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('les badges désactivés ont la classe line-through', () => {
      render(<HabilitationsTable habilitations={null} />);
      const disabled = document.querySelectorAll('span.line-through');
      disabled.forEach((badge) => {
        expect(badge.className).toContain('text-gray-400');
      });
    });

    it('les badges désactivés n\'ont pas la classe text-green-700', () => {
      render(<HabilitationsTable habilitations={null} />);
      const disabled = document.querySelectorAll('span.line-through');
      disabled.forEach((badge) => {
        expect(badge.className).not.toContain('text-green-700');
      });
    });
  });

  describe('badges activés', () => {
    it('les badges activés ont la classe bg-green-100', () => {
      render(<HabilitationsTable habilitations={allEnabled} />);
      const badges = document.querySelectorAll('span.bg-green-100');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('les badges activés ont la classe text-green-700', () => {
      render(<HabilitationsTable habilitations={allEnabled} />);
      const badges = document.querySelectorAll('span.text-green-700');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('les badges activés n\'ont pas la classe line-through', () => {
      render(<HabilitationsTable habilitations={allEnabled} />);
      const green = document.querySelectorAll('span.bg-green-100');
      green.forEach((badge) => {
        expect(badge.className).not.toContain('line-through');
      });
    });

    it('les badges activés n\'ont pas la classe bg-amber-100', () => {
      render(<HabilitationsTable habilitations={allEnabled} />);
      const amber = document.querySelectorAll('span.bg-amber-100');
      expect(amber.length).toBe(0);
    });
  });

  describe('structure du tableau', () => {
    it('affiche les 2 lignes de tension (Basse tension et Haute tension)', () => {
      render(<HabilitationsTable habilitations={null} />);
      expect(screen.getByText('Basse tension')).toBeInTheDocument();
      expect(screen.getByText('Haute tension')).toBeInTheDocument();
    });

    it('affiche les en-têtes de colonnes', () => {
      render(<HabilitationsTable habilitations={null} />);
      expect(screen.getByText('Opération d\'ordre non électrique')).toBeInTheDocument();
      expect(screen.getByText('Opération d\'ordre électrique')).toBeInTheDocument();
    });

    it('affiche le badge B0', () => {
      render(<HabilitationsTable habilitations={null} />);
      expect(screen.getAllByText('B0').length).toBeGreaterThan(0);
    });

    it('affiche le badge BC', () => {
      render(<HabilitationsTable habilitations={null} />);
      expect(screen.getByText('BC')).toBeInTheDocument();
    });

    it('affiche le badge HC', () => {
      render(<HabilitationsTable habilitations={null} />);
      expect(screen.getByText('HC')).toBeInTheDocument();
    });

    it('affiche un tiret pour les cellules nulles (HT non électrique exécutant)', () => {
      render(<HabilitationsTable habilitations={null} />);
      const dashes = screen.getAllByText('—');
      expect(dashes.length).toBeGreaterThan(0);
    });
  });

  describe('rendu mixte (certaines activées, d\'autres non)', () => {
    it('affiche B0 en vert et H0 en gris barré quand seul b0 est activé', () => {
      const partial: HabilitationCodes = { ...DEFAULT_HABILITATIONS, b0: true };
      render(<HabilitationsTable habilitations={partial} />);

      const greenBadges = document.querySelectorAll('span.bg-green-100');
      const disabledBadges = document.querySelectorAll('span.line-through');

      expect(greenBadges.length).toBeGreaterThan(0);
      expect(disabledBadges.length).toBeGreaterThan(0);
    });
  });
});
