import Image from 'next/image';
import { Phone, TriangleAlert } from 'lucide-react';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

const EMERGENCY_CONTACTS = [
  {
    label: 'SAMU',
    number: '15',
    description: 'Urgences médicales',
  },
  {
    label: 'Police / Gendarmerie',
    number: '17',
    description: 'Urgences sécurité',
  },
  {
    label: 'Pompiers',
    number: '18',
    description: 'Incendie & secours',
  },
  {
    label: 'Toutes urgences',
    number: '112',
    description: 'Numéro européen',
  },
] as const;

export default function UrgencesPage() {
  return (
    <PageContainer width="default">
      <PageHeader
        icon={
          <Image
            src="/images/emergency-phone.png"
            alt=""
            width={24}
            height={24}
            className="object-contain"
          />
        }
        title="Numéros d'urgence"
        description="Contacts essentiels en cas d'urgence"
      />

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {EMERGENCY_CONTACTS.map((contact) => (
          <li key={contact.number}>
            <a
              href={`tel:${contact.number}`}
              className="group flex items-center gap-4 rounded-xl border bg-card p-4 shadow-card transition-all duration-200 hover:border-primary/30 hover:shadow-elevated active:scale-[0.98] sm:p-5"
            >
              <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary text-2xl font-bold tabular-nums text-primary-foreground shadow-brand">
                {contact.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold">
                  {contact.label}
                </span>
                <span className="block text-sm text-muted-foreground">
                  {contact.description}
                </span>
              </span>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Phone className="size-4" />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div
        role="note"
        className="mt-6 flex gap-3 rounded-xl border border-warning/30 bg-warning-soft p-4"
      >
        <TriangleAlert
          className="mt-0.5 size-5 shrink-0 text-warning-soft-foreground"
          strokeWidth={1.75}
        />
        <div>
          <p className="text-sm font-semibold text-warning-soft-foreground">
            En cas de danger sur chantier
          </p>
          <p className="mt-1 text-sm text-foreground/80">
            Sécuriser la zone, alertez les secours, ne déplacer pas la victime
            sauf danger immédiat. Restez en ligne avec les secours jusqu'à leur
            arrivée.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
