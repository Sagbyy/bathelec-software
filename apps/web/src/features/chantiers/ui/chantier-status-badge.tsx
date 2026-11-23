import { Chantier, DerivationStatus } from '@repo/types';
import type { Tone } from '@/shared/lib/tone';
import { Badge } from '@/shared/ui/badge';
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
  { label: string; icon: string; tone: Tone }
> = {
  'not-started': {
    label: 'À démarrer',
    icon: 'mdi:clipboard-outline',
    tone: 'neutral',
  },
  ongoing: {
    label: 'En cours',
    icon: 'mdi:clock-outline',
    tone: 'info',
  },
  finished: {
    label: 'Terminé',
    icon: 'mdi:check-circle-outline',
    tone: 'success',
  },
};

export function ChantierStatusBadge({ chantier }: { chantier: Chantier }) {
  const status = getChantierStatus(chantier);
  const config = CONFIG[status];
  return (
    <Badge variant={config.tone} className="py-1">
      <Icon className="size-3.5 shrink-0" icon={config.icon} />
      {config.label}
    </Badge>
  );
}
