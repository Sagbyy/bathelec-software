import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { CalendarIcon, FileTextIcon, MapPinIcon, HashIcon } from 'lucide-react';
import { Chantier, DerivationStatus } from '@repo/types';
import { derivationStatusConfig } from '@/entities/derivation';

interface InfoCardProps {
  reference: string;
  status: DerivationStatus;
  chantier: Chantier | null;
  createdAt: string;
}

export function InfoCard({
  reference,
  status,
  chantier,
  createdAt,
}: InfoCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex items-start gap-2">
              <FileTextIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="text-sm font-semibold">{reference}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="text-sm font-medium">
                {chantier?.address ?? 'Pas de chantier renseigné.'}
              </span>
            </div>
            {chantier && (
              <div className="flex items-start gap-2">
                <HashIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground text-xs">
                  Enedis: {chantier.enedisAffaireNumber} · Interne:{' '}
                  {chantier.internalAffaireNumber}
                  {chantier.market && ` · ${chantier.market.name}`}
                </span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <CalendarIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">
                Créé le {formatDate(createdAt)}
              </span>
            </div>
          </div>
          <Badge variant={derivationStatusConfig[status].tone}>
            {derivationStatusConfig[status].text}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
