import { Role } from '@repo/types';
import { DerivationStatus } from '../../types/derivations-status.enum';
import {
  canFillDerivation,
  canViewDerivation,
  isEditableInTheField,
  requiresCorrectionComment,
} from './derivation-access.policy';

const admin = { userId: 1, role: Role.ADMIN };
const supervisor = { userId: 2, role: Role.SUPERVISOR };
const technician = { userId: 42, role: Role.TECHNICIAN };
const siteManager = { userId: 7, role: Role.SITE_MANAGER };

const assignedToTechnician = { userId: 42, teamId: 3 };
const assignedToSomeoneElse = { userId: 99, teamId: 3 };
const unassignedTeamDerivation = { userId: null, teamId: 3 };

describe('canViewDerivation', () => {
  it.each([[admin], [supervisor]])(
    'autorise la direction à tout consulter (%j)',
    (actor) => {
      expect(canViewDerivation(assignedToSomeoneElse, actor, false)).toBe(true);
    }
  );

  it("autorise le technicien attribué même hors de l'équipe", () => {
    expect(canViewDerivation(assignedToTechnician, technician, false)).toBe(
      true
    );
  });

  it("refuse à un technicien la dérivation d'un collègue de son équipe", () => {
    expect(canViewDerivation(assignedToSomeoneElse, technician, true)).toBe(
      false
    );
  });

  it('autorise un membre de l’équipe à voir une dérivation non attribuée', () => {
    expect(canViewDerivation(unassignedTeamDerivation, technician, true)).toBe(
      true
    );
  });

  it('refuse une dérivation non attribuée d’une autre équipe', () => {
    expect(canViewDerivation(unassignedTeamDerivation, technician, false)).toBe(
      false
    );
  });

  it('autorise un chef de chantier à voir les dérivations de son équipe', () => {
    expect(canViewDerivation(assignedToSomeoneElse, siteManager, true)).toBe(
      true
    );
  });

  it('refuse à un chef de chantier les dérivations d’une autre équipe', () => {
    expect(canViewDerivation(assignedToSomeoneElse, siteManager, false)).toBe(
      false
    );
  });
});

describe('canFillDerivation', () => {
  it('autorise le technicien attribué', () => {
    expect(canFillDerivation(assignedToTechnician, technician, false)).toBe(
      true
    );
  });

  it.each([[technician], [siteManager]])(
    "refuse de remplir la dérivation attribuée à quelqu'un d'autre (%j)",
    (actor) => {
      expect(canFillDerivation(assignedToSomeoneElse, actor, true)).toBe(false);
    }
  );

  it('autorise un membre de l’équipe à remplir une dérivation non attribuée', () => {
    expect(canFillDerivation(unassignedTeamDerivation, technician, true)).toBe(
      true
    );
  });

  it('refuse une dérivation non attribuée hors de son équipe', () => {
    expect(canFillDerivation(unassignedTeamDerivation, technician, false)).toBe(
      false
    );
  });

  it("refuse à l'admin de remplir un relevé", () => {
    expect(canFillDerivation(assignedToSomeoneElse, admin, false)).toBe(false);
  });
});

describe('isEditableInTheField (RG-04)', () => {
  it.each([
    [DerivationStatus.PENDING, true],
    [DerivationStatus.ONGOING, true],
    [DerivationStatus.REVISING, true],
    [DerivationStatus.REVIEWING, false],
    [DerivationStatus.COMPLETED, false],
  ])('%s → %s', (status, expected) => {
    expect(isEditableInTheField(status)).toBe(expected);
  });
});

describe('requiresCorrectionComment (RG-12)', () => {
  it.each([[undefined], [null], [''], ['  ']])(
    'exige un commentaire pour un renvoi en correction (%j)',
    (comment) => {
      expect(
        requiresCorrectionComment(DerivationStatus.REVISING, comment)
      ).toBe(true);
    }
  );

  it('accepte un renvoi accompagné d’un commentaire', () => {
    expect(
      requiresCorrectionComment(DerivationStatus.REVISING, 'Photo floue')
    ).toBe(false);
  });

  it('n’exige rien pour une validation', () => {
    expect(requiresCorrectionComment(DerivationStatus.COMPLETED, null)).toBe(
      false
    );
  });
});
