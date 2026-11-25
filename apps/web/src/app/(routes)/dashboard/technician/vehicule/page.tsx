import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { OwnVehicleDocumentBadge } from '@/features/vehicle-documents';

const DOCUMENT_CARDS = [
  {
    documentKey: 'vehicleRegistration',
    label: 'Carte grise de mon véhicule',
    href: '/dashboard/technician/vehicule/vehicle-registration',
    image: '/images/vehicle-registration.svg',
  },
  {
    documentKey: 'drivingLicense',
    label: 'Mon permis de conduire',
    href: '/dashboard/technician/vehicule/driving-license',
    image: '/images/driving-license.jpg',
  },
] as const;

export default function VehiculePage() {
  return (
    <PageContainer width="default">
      <PageHeader
        icon={
          <Image
            src="/images/vehicle-inspection-page.png"
            alt=""
            width={24}
            height={24}
            className="object-contain"
          />
        }
        title="Mon véhicule"
        description="Carte grise et permis de conduire"
      />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {DOCUMENT_CARDS.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="group flex h-full items-center gap-4 rounded-xl border bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated active:scale-[0.98] sm:flex-col sm:items-stretch sm:p-5"
            >
              <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-full">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 480px, 80px"
                  className="object-contain p-2"
                />
              </span>
              <span className="flex flex-1 items-center justify-between gap-2">
                <span className="flex flex-col items-start gap-1.5">
                  <span className="text-sm font-semibold sm:text-base">
                    {card.label}
                  </span>
                  <OwnVehicleDocumentBadge documentKey={card.documentKey} />
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
