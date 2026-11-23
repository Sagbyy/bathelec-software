'use client';

import Image from 'next/image';
import { useUserStore } from '@/entities/user';
import { useHabilitation } from '@/entities/habilitation';
import { useSpecialHabilitation } from '@/entities/special-habilitation';
import { HabilitationsTable } from '@/features/habilitations';
import { SpecialHabilitationsCards } from '@/features/special-habilitations';
import { ValidityBadge } from '@/shared/ui/validity-date-field';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

export default function HabilitationsPage() {
  const user = useUserStore((s) => s.user);
  const userId = user?.id;

  const { data: habilitations, isLoading: loadingHabilitations } =
    useHabilitation(userId!);
  const { data: specialHabilitations, isLoading: loadingSpecial } =
    useSpecialHabilitation(userId!);

  const isLoading = loadingHabilitations || loadingSpecial;

  return (
    <PageContainer width="default">
      <PageHeader
        icon={
          <Image
            src="/images/habilitation-page.png"
            alt=""
            width={24}
            height={24}
            className="object-contain"
          />
        }
        title="Mes habilitations"
        description="Habilitations électriques selon la norme NF C 18-510"
      />

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
              Titres &amp; certificats
            </h2>
            <SpecialHabilitationsCards
              habilitations={specialHabilitations ?? null}
            />
          </section>

          <section>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Habilitations NF C 18-510
              </h2>
              <ValidityBadge expiresAt={habilitations?.expiresAt} />
            </div>
            <HabilitationsTable habilitations={habilitations ?? null} />
          </section>
        </div>
      )}
    </PageContainer>
  );
}
