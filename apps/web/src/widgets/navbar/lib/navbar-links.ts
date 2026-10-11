import { Role } from '@repo/types';
import { NavbarLink } from '@/entities/user';

export const adminLinks: NavbarLink[] = [
  {
    label: 'Utilisateurs',
    href: '#',
    type: 'folder',
    allowedRoles: [Role.ADMIN, Role.SUPERVISOR],
    pages: [
      {
        label: 'Liste des utilisateurs',
        href: '/dashboard/admin/users',
        description: 'Voir la liste des utilisateurs',
        type: 'page',
      },
    ],
  },
  {
    label: 'Techniciens',
    href: '#',
    type: 'folder',
    allowedRoles: [Role.ADMIN, Role.SUPERVISOR],
    pages: [
      {
        label: 'Liste des techniciens',
        href: '/dashboard/admin/technicians',
        type: 'page',
        description: 'Voir la liste des techniciens',
      },
      {
        label: 'Créez un technicien',
        href: '/dashboard/admin/technicians/new',
        type: 'page',
        description: "Création d'un nouveau compte technicien",
      },
      {
        label: 'Groupes de techniciens',
        href: '/dashboard/admin/technicians/group',
        type: 'page',
        description: 'Voir la liste des groupes de techniciens',
      },
    ],
  },
  {
    label: 'Relevés de dérivation',
    href: '#',
    type: 'folder',
    allowedRoles: [Role.ADMIN],
    pages: [
      {
        label: 'Créez un relevé de dérivation',
        href: '/dashboard/admin/derivations/new',
        type: 'page',
        description: "Création d'un nouveau relevé de dérivation",
      },
    ],
  },
  {
    label: 'Chantiers',
    href: '#',
    type: 'folder',
    allowedRoles: [Role.ADMIN, Role.SUPERVISOR],
    pages: [
      {
        label: 'Créer un marché',
        href: '/dashboard/admin/markets/new',
        type: 'page',
        description: 'Ajouter un marché',
      },
      {
        label: 'Créer un chantier',
        href: '/dashboard/admin/chantiers/new',
        type: 'page',
        description: 'Ajouter un chantier à un marché',
      },
    ],
  },
];

export function getVisibleAdminLinks(role: Role): NavbarLink[] {
  return adminLinks.filter((link) =>
    (link.allowedRoles ?? [Role.ADMIN]).includes(role)
  );
}
