import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

const DOCUMENT_CARDS = [
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
  {
    label: 'Carte Mutuelle',
    href: '/dashboard/technician/documents/mutual-card',
    image: '/images/pro-btp-mutual.png',
  },
] as const;

export default function DocumentsPage() {
  return (
    <PageContainer width="default">
      <PageHeader
        icon={
          <Image
            src="/images/identity-card-page.png"
            alt=""
            width={24}
            height={24}
            className="object-contain"
          />
        }
        title="Mes documents officiels"
        description="Pièce d'identité, carte BTP et mutuelle"
      />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {DOCUMENT_CARDS.map((card) => (
          <li key={card.href}>
            <DocumentLinkCard {...card} />
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}

function DocumentLinkCard({
  label,
  href,
  image,
}: {
  label: string;
  href: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full items-center gap-4 rounded-xl border bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated active:scale-[0.98] sm:flex-col sm:items-stretch sm:p-5"
    >
      <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-full">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 640px) 320px, 80px"
          className="object-contain p-2"
        />
      </span>
      <span className="flex flex-1 items-center justify-between gap-2">
        <span className="text-sm font-semibold sm:text-base">{label}</span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </span>
    </Link>
  );
}
