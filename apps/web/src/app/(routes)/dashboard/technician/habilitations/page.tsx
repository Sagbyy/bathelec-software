'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/entities/user';
import { useHabilitation } from '@/entities/habilitation';
import { useSpecialHabilitation } from '@/entities/special-habilitation';
import { HabilitationsTable } from '@/features/habilitations';
import { SpecialHabilitationsCards } from '@/features/special-habilitations';

export default function HabilitationsPage() {
  const user = useUserStore((s) => s.user);
  const userId = user?.id;

  const { data: habilitations, isLoading: loadingHabilitations } =
    useHabilitation(userId!);
  const { data: specialHabilitations, isLoading: loadingSpecial } =
    useSpecialHabilitation(userId!);

  const isLoading = loadingHabilitations || loadingSpecial;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Image
          src="/images/habilitation-page.png"
          alt=""
          width={48}
          height={48}
          className="shrink-0 object-contain"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Mes habilitations
          </h1>
          <p className="text-muted-foreground text-sm">
            Habilitations électriques selon la norme NF C 18-510
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-base font-semibold text-gray-700">
              Titres &amp; certificats
            </h2>
            <SpecialHabilitationsCards
              habilitations={specialHabilitations ?? null}
            />
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold text-gray-700">
              Habilitations NF C 18-510
            </h2>
            <HabilitationsTable habilitations={habilitations ?? null} />
          </section>
        </div>
      )}
    </div>
  );
}
