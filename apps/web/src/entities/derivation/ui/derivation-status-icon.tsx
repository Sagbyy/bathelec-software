import { DerivationStatus } from '@repo/types';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Badge } from '@/shared/ui/badge';
import { derivationStatusConfig } from '../model/derivation-status.config';

export default function DerivationStatusIcon({
  derivationStatus,
}: {
  derivationStatus: DerivationStatus;
}) {
  const { tone, icon, text } = derivationStatusConfig[derivationStatus];

  return (
    <Badge variant={tone} className="py-1">
      <Icon className="size-3.5 shrink-0" icon={icon} />
      {text}
    </Badge>
  );
}
