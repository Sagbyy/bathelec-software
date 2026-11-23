export interface TechnicianNavItem {
  label: string;
  description?: string;
  href: string;
  imageSrc: string;
}

export interface TechnicianNavSection {
  title: string;
  items: TechnicianNavItem[];
}

export const FEATURED_ITEM: TechnicianNavItem = {
  label: 'TOP Chantiers',
  href: '/dashboard/technician/top-chantiers',
  imageSrc: '/images/top-chantier.png',
};

export const NAV_SECTIONS: TechnicianNavSection[] = [
  {
    title: 'Mes chantiers',
    items: [
      {
        label: 'Mes dérivations',
        description: 'Relevés qui vous sont assignés',
        href: '/dashboard/technician/assignments',
        imageSrc: '/images/builder.png',
      },
      {
        label: 'Chantiers programmés',
        description: 'Planning à venir',
        href: '/dashboard/technician/scheduled-chantiers',
        imageSrc: '/images/site-supervisor.png',
      },
      {
        label: 'Chantiers en cours',
        description: 'Interventions actives',
        href: '/dashboard/technician/derivations',
        imageSrc: '/images/red-folder.png',
      },
      {
        label: 'Chantiers terminés',
        description: 'Historique',
        href: '/dashboard/technician/derivations/complete',
        imageSrc: '/images/green-folder.png',
      },
    ],
  },
  {
    title: 'Mon espace',
    items: [
      {
        label: 'Mes documents officiels',
        description: 'Identité, carte BTP, mutuelle',
        href: '/dashboard/technician/documents',
        imageSrc: '/images/identity-card-page.png',
      },
      {
        label: 'Mes habilitations',
        description: 'Électriques et spéciales',
        href: '/dashboard/technician/habilitations',
        imageSrc: '/images/habilitation-page.png',
      },
      {
        label: 'Mon véhicule',
        description: 'Permis et carte grise',
        href: '/dashboard/technician/vehicule',
        imageSrc: '/images/vehicle-inspection-page.png',
      },
      {
        label: "Numéros d'urgence",
        description: 'SAMU, pompiers, police',
        href: '/dashboard/technician/urgences',
        imageSrc: '/images/emergency-phone.png',
      },
    ],
  },
];
