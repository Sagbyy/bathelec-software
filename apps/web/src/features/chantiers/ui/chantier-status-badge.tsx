import { Chantier, DerivationStatus } from '@repo/types';
import { cn } from '@/shared/lib/utils';
import { Icon } from '@iconify/react/dist/iconify.js';

export type ChantierStatus = 'not-started' | 'ongoing' | 'finished';

export function getChantierStatus(chantier: Chantier): ChantierStatus {
  const derivations = chantier.derivations ?? [];
  if (derivations.length === 0) return 'not-started';
  if (derivations.every((d) => d.status === DerivationStatus.COMPLETED))
    return 'finished';
  return 'ongoing';
}

const CONFIG: Record<
  ChantierStatus,
  { label: string; icon: string; className: string }
> = {
  'not-started': {
    label: 'À démarrer',
    icon: 'mdi:clipboard-outline',
    className: 'text-slate-500',
  },
  ongoing: {
    label: 'En cours',
    icon: 'mdi:clock-outline',
    className: 'text-blue-500',
  },
  finished: {
    label: 'Terminé',
    icon: 'mdi:check-circle-outline',
    className: 'text-green-500',
  },
};

export function ChantierStatusBadge({ chantier }: { chantier: Chantier }) {
  const status = getChantierStatus(chantier);
  const config = CONFIG[status];
  return (
    <div className={cn(config.className, 'flex items-center gap-2')}>
      <Icon className="shrink-0" icon={config.icon} />
      <span className="font-semibold">{config.label}</span>
    </div>
  );
}
