import { Role } from '@repo/types';
import { NavbarLink } from '@/entities/user';

export const dashboardLink: NavbarLink = {
  label: 'Tableau de bord',
  href: '/dashboard',
  type: 'page',
  description: 'Accéder au tableau de bord',
};

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
        label: 'Équipes chantier',
        href: '/dashboard/admin/site-teams',
        type: 'page',
        description: 'Voir et gérer les équipes chantier',
      },
    ],
  },
  {
    label: 'Relevés de dérivation',
    href: '#',
    type: 'folder',
    allowedRoles: [Role.ADMIN, Role.SUPERVISOR],
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
        label: 'Liste des chantiers',
        href: '/dashboard/admin/chantiers',
        type: 'page',
        description: 'Consulter les chantiers et gérer leurs documents',
      },
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

export const technicianLinks: NavbarLink[] = [
  {
    label: 'Chantiers',
    href: '#',
    type: 'folder',
    allowedRoles: [Role.TECHNICIAN],
    pages: [
      {
        label: 'Top Chantiers',
        href: '/dashboard/technician/top-chantiers',
        type: 'page',
        description: 'Classement de vos meilleurs chantiers',
      },
      {
        label: 'Chantiers en cours',
        href: '/dashboard/technician/derivations',
        type: 'page',
        description: 'Vos interventions actives',
      },
      {
        label: 'Chantiers terminés',
        href: '/dashboard/technician/derivations/complete',
        type: 'page',
        description: 'Historique de vos chantiers terminés',
      },
      {
        label: 'Nouveau relevé de dérivation',
        href: '/dashboard/technician/derivations/new',
        type: 'page',
        description: "Création d'un nouveau relevé de dérivation",
      },
    ],
  },
  {
    label: 'Mon espace',
    href: '#',
    type: 'folder',
    allowedRoles: [Role.TECHNICIAN],
    pages: [
      {
        label: 'Mes documents officiels',
        href: '/dashboard/technician/documents',
        type: 'page',
        description: 'Vos documents administratifs',
      },
      {
        label: 'Mes habilitations',
        href: '/dashboard/technician/habilitations',
        type: 'page',
        description: 'Vos habilitations électriques',
      },
      {
        label: 'Mon véhicule',
        href: '/dashboard/technician/vehicule',
        type: 'page',
        description: 'Informations sur votre véhicule de service',
      },
      {
        label: "Numéros d'urgence",
        href: '/dashboard/technician/urgences',
        type: 'page',
        description: "Contacts essentiels en cas d'urgence",
      },
    ],
  },
];

const isVisibleTo = (role: Role) => (link: NavbarLink) =>
  (link.allowedRoles ?? [Role.ADMIN]).includes(role);

export function getVisibleAdminLinks(role: Role): NavbarLink[] {
  return adminLinks.filter(isVisibleTo(role));
}

export function getNavigationLinks(role: Role): NavbarLink[] {
  return [
    dashboardLink,
    ...adminLinks.filter(isVisibleTo(role)),
    ...technicianLinks.filter(isVisibleTo(role)),
  ];
}

export function isLinkActive(pathname: string, link: NavbarLink): boolean {
  if (link.type === 'folder') {
    return (link.pages ?? []).some((page) => isLinkActive(pathname, page));
  }
  if (link.href === dashboardLink.href) return pathname === link.href;
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

const flattenPages = (links: NavbarLink[]): NavbarLink[] =>
  links.flatMap((link) =>
    link.type === 'folder' ? flattenPages(link.pages ?? []) : [link]
  );

export function getActiveHref(
  pathname: string,
  links: NavbarLink[]
): string | undefined {
  return flattenPages(links)
    .filter((page) => isLinkActive(pathname, page))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}
