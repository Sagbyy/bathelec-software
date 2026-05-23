import { FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const ROW_ONE = [
  {
    label: "Pièce d'identité ou titre de séjour",
    href: '/dashboard/technician/documents/id-card',
    image: '/images/identity-card-and-residence-permit.png',
  },
  {
    label: 'Carte Pro du BTP',
    href: '/dashboard/technician/documents/btp-card',
    image: '/images/btp-card.png',
  },
] as const;

const ROW_TWO = [
  {
    label: 'Carte Mutuelle',
    href: '/dashboard/technician/documents/mutual-card',
    image: '/images/pro-btp-mutual.png',
  },
] as const;

export default function DocumentsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100">
          <FileText className="h-6 w-6 text-purple-600" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Mes documents officiels
          </h1>
          <p className="text-muted-foreground text-sm">
            Pièce d'identité, carte BTP et mutuelle
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ROW_ONE.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              <div className="relative h-32 w-full overflow-hidden rounded-xl">
                <Image src={card.image} alt={card.label} fill className="object-contain" />
              </div>
              <p className="text-center text-base font-semibold text-gray-900">
                {card.label}
              </p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1">
          {ROW_TWO.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              <div className="relative h-32 w-full overflow-hidden rounded-xl">
                <Image src={card.image} alt={card.label} fill className="object-contain" />
              </div>
              <p className="text-center text-base font-semibold text-gray-900">
                {card.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
