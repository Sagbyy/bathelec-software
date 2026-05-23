import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { CalendarIcon, MapPinIcon, HashIcon } from 'lucide-react';
import { Chantier, DerivationStatus } from '@repo/types';
import { cn } from '@/shared/lib/utils';
import { derivationStatusConfig } from '@/entities/derivation';

interface InfoCardProps {
  status: DerivationStatus;
  chantier: Chantier | null;
  createdAt: string;
}

export function InfoCard({ status, chantier, createdAt }: InfoCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Card className="sticky top-4 z-10 mb-6 !shadow">
      <CardContent className="p-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <MapPinIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">
                {chantier?.address ?? "Pas de chantier renseigné."}
              </span>
            </div>
            {chantier && (
              <div className="flex items-center gap-2">
                <HashIcon className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground text-xs">
                  Enedis: {chantier.enedisAffaireNumber} · Interne: {chantier.internalAffaireNumber}
                  {chantier.market && ` · ${chantier.market.name}`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-sm">
                Créé le {formatDate(createdAt)}
              </span>
            </div>
          </div>
          <Badge
            className={cn(
              derivationStatusConfig[status].textDarkColor,
              derivationStatusConfig[status].backgroundColor,
              'border-none'
            )}
            variant="outline"
          >
            {derivationStatusConfig[status].text}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
