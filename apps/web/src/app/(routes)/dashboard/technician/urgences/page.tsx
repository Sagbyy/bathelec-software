import { PhoneCall } from 'lucide-react';

const EMERGENCY_CONTACTS = [
  { label: 'SAMU', number: '15', description: 'Urgences médicales' },
  { label: 'Police / Gendarmerie', number: '17', description: 'Urgences sécurité' },
  { label: 'Pompiers', number: '18', description: 'Incendie & secours' },
  { label: 'Numéro européen', number: '112', description: 'Toutes urgences' },
] as const;

export default function UrgencesPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500">
            <PhoneCall className="h-7 w-7 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Numéros d'urgence</h1>
            <p className="text-muted-foreground text-sm">Contacts essentiels en cas d'urgence</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {EMERGENCY_CONTACTS.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.number}`}
              className="flex items-center justify-between rounded-2xl border border-red-100 bg-white p-4 shadow-sm transition-all duration-150 active:scale-95 hover:shadow-md hover:border-red-200"
            >
              <div>
                <p className="font-semibold text-gray-900">{contact.label}</p>
                <p className="text-muted-foreground text-sm">{contact.description}</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50">
                <span className="text-lg font-bold text-red-600">{contact.number}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
