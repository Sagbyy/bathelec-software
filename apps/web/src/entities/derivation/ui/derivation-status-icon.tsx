import { DerivationStatus } from '@repo/types';
import { cn } from '@/shared/lib/utils';
import { derivationStatusConfig } from '../model/derivation-status.config';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function DerivationStatusIcon({
  derivationStatus,
}: {
  derivationStatus: DerivationStatus;
}) {
  return (
    <div
      className={cn(
        derivationStatusConfig[derivationStatus].textColor,
        'flex items-center gap-2'
      )}
    >
      <Icon
        className="shrink-0"
        icon={derivationStatusConfig[derivationStatus].icon}
      />
      <span className="font-semibold">
        {derivationStatusConfig[derivationStatus].text}
      </span>
    </div>
  );
}
