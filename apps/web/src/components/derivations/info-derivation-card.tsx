import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { DerivationStatus } from '@repo/types';
import { cn } from '@/lib/utils';
import { derivationStatusConfig } from '@/constants/derivations';

interface InfoCardProps {
  status: DerivationStatus;
  city: string;
  postalCode: string;
  address: string;
  createdAt: string;
}

export function InfoCard({
  status,
  city,
  postalCode,
  address,
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
    <Card className="sticky top-4 z-10 mb-6 !shadow">
      <CardContent className="p-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <MapPinIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">
                {address && postalCode && city
                  ? `${address}, ${postalCode} ${city}`
                  : "Pas d'adresse renseignée par le manager"}
              </span>
            </div>
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
