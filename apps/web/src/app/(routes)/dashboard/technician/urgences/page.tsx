import Image from 'next/image';
import { TriangleAlert } from 'lucide-react';

const EMERGENCY_CONTACTS = [
  {
    label: 'SAMU',
    number: '15',
    description: 'Urgences médicales',
    color: 'blue',
  },
  {
    label: 'Police / Gendarmerie',
    number: '17',
    description: 'Urgences sécurité',
    color: 'purple',
  },
  {
    label: 'Pompiers',
    number: '18',
    description: 'Incendie & secours',
    color: 'red',
  },
  {
    label: 'Toutes urgences',
    number: '112',
    description: 'Numéro européen',
    color: 'green',
  },
] as const;

const COLOR_CLASSES = {
  blue: 'bg-blue-500 border-blue-600 hover:bg-blue-600',
  purple: 'bg-purple-500 border-purple-600 hover:bg-purple-600',
  red: 'bg-red-500 border-red-600 hover:bg-red-600',
  green: 'bg-green-500 border-green-600 hover:bg-green-600',
} as const;

export default function UrgencesPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <Image
            src="/images/emergency-phone.png"
            alt=""
            width={56}
            height={56}
            className="shrink-0 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Numéros d'urgence
            </h1>
            <p className="text-muted-foreground text-sm">
              Contacts essentiels en cas d'urgence
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {EMERGENCY_CONTACTS.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.number}`}
              className={`flex flex-col items-center justify-center rounded-2xl border px-4 py-8 shadow-sm transition-all duration-150 hover:shadow-md active:scale-95 ${COLOR_CLASSES[contact.color]}`}
            >
              <span className="text-7xl font-extrabold leading-none text-white">
                {contact.number}
              </span>
              <p className="mt-4 text-center text-base font-semibold text-white">
                {contact.label}
              </p>
              <p className="mt-1 text-center text-sm text-white/80">
                {contact.description}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-6 flex gap-3 rounded-2xl border border-yellow-300 bg-yellow-50 p-4">
          <TriangleAlert
            className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600"
            strokeWidth={1.75}
          />
          <div>
            <p className="text-sm font-semibold text-yellow-800">
              En cas de danger sur chantier
            </p>
            <p className="mt-1 text-sm text-yellow-700">
              Sécuriser la zone, alertez les secours, ne déplacer pas la victime
              sauf danger immédiat. Restez en ligne avec les secours jusqu'à
              leur arrivée.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
