import { Car } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const DOCUMENT_CARDS = [
  {
    label: 'Carte grise de mon véhicule',
    href: '/dashboard/technician/vehicule/vehicle-registration',
    image: '/images/vehicle-registration.svg',
  },
  {
    label: 'Mon permis de conduire',
    href: '/dashboard/technician/vehicule/driving-license',
    image: '/images/driving-license.jpg',
  },
] as const;

export default function VehiculePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Car className="h-6 w-6 text-slate-600" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon véhicule</h1>
          <p className="text-muted-foreground text-sm">
            Carte grise et permis de conduire
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {DOCUMENT_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
          >
            <div className="relative h-32 w-full overflow-hidden rounded-xl">
              <Image
                src={card.image}
                alt={card.label}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-center text-base font-semibold text-gray-900">
              {card.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
