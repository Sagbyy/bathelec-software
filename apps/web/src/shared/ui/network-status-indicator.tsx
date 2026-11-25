import { CloudOff, CloudUpload, TriangleAlert, Wifi } from 'lucide-react';
import { Badge } from './badge';

interface NetworkStatusIndicatorProps {
  online: boolean;
  pendingCount: number;
  rejectedCount: number;
}

const pendingLabel = (count: number) =>
  count === 1 ? '1 envoi en attente' : `${count} envois en attente`;

const rejectedLabel = (count: number) =>
  count === 1 ? '1 envoi refusé' : `${count} envois refusés`;

export function NetworkStatusIndicator({
  online,
  pendingCount,
  rejectedCount,
}: Readonly<NetworkStatusIndicatorProps>) {
  return (
    <div className="flex items-center gap-1" aria-live="polite">
      {online ? (
        <Badge variant="success" title="Connecté au réseau">
          <Wifi />
          <span className="sr-only sm:not-sr-only">En ligne</span>
        </Badge>
      ) : (
        <Badge variant="warning" title="Aucune connexion réseau">
          <CloudOff />
          Hors ligne
        </Badge>
      )}
      {pendingCount > 0 && (
        <Badge variant="info" title={pendingLabel(pendingCount)}>
          <CloudUpload />
          <span aria-hidden="true">{pendingCount}</span>
          <span className="sr-only">{pendingLabel(pendingCount)}</span>
        </Badge>
      )}
      {rejectedCount > 0 && (
        <Badge variant="destructive" title={rejectedLabel(rejectedCount)}>
          <TriangleAlert />
          <span aria-hidden="true">{rejectedCount}</span>
          <span className="sr-only">{rejectedLabel(rejectedCount)}</span>
        </Badge>
      )}
    </div>
  );
}
