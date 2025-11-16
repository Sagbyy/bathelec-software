import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { DerivationStatus } from '@repo/types';

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case DerivationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case DerivationStatus.COMPLETED:
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case DerivationStatus.INCORRECT:
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

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
          <Badge className={`${getStatusColor(status)}`} variant="outline">
            {status === DerivationStatus.PENDING && 'En cours'}
            {status === DerivationStatus.COMPLETED && 'Terminé'}
            {status === DerivationStatus.INCORRECT && 'Incorrecte'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
