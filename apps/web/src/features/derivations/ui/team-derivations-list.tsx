'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ClipboardList } from 'lucide-react';
import { Derivation, Role } from '@repo/types';
import { Button } from '@/shared/ui/button';
import {
  DerivationStatusIcon,
  getDerivationReference,
} from '@/entities/derivation';
import { useUserStore } from '@/entities/user';
import { NativeSelect } from '@/shared/ui/native-select';
import { EmptyState } from '@/shared/ui/empty-state';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  formatMemberName,
  getTeamMembers,
  siteTeamQueries,
  withCurrentAssignee,
  type SiteTeamWithMembers,
} from '@/entities/site-team';
import {
  useAssignDerivationUser,
  useClaimDerivation,
  useMyDerivations,
} from '../model/use-derivation-assignment';
import { getAssignmentAction } from '../lib/derivation-assignment';

const COMPLETE_PATH = '/dashboard/technician/derivations/complete';

export function TeamDerivationsList() {
  const { user } = useUserStore();
  const { data: derivations, isLoading, error } = useMyDerivations();
  const { data: teams } = useQuery(siteTeamQueries.mine());

  if (!user) return null;
  if (isLoading)
    return (
      <div className="space-y-3" aria-label="Chargement...">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  if (error)
    return (
      <EmptyState
        title="Une erreur est survenue"
        description="Impossible de charger vos dérivations."
      />
    );
  if (!derivations?.length) {
    return (
      <EmptyState
        icon={<ClipboardList />}
        title="Aucune dérivation à traiter."
        description="Les dérivations attribuées à votre équipe apparaîtront ici."
      />
    );
  }

  return (
    <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-card">
      {derivations.map((derivation) => (
        <li
          key={derivation.id}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        >
          <div className="flex min-w-0 flex-col items-start gap-1.5">
            <span className="font-semibold leading-snug text-foreground">
              {derivation.chantier?.address ?? `Dérivation #${derivation.id}`}
            </span>
            <span className="text-sm text-muted-foreground">
              {getDerivationReference(derivation)} ·{' '}
              {derivation.team?.name ?? 'Sans équipe'}
            </span>
            <DerivationStatusIcon derivationStatus={derivation.status} />
          </div>
          <DerivationAssignmentControl
            derivation={derivation}
            currentUser={{ id: user.id, role: user.role }}
            teams={teams}
          />
        </li>
      ))}
    </ul>
  );
}

interface DerivationAssignmentControlProps {
  derivation: Derivation;
  currentUser: { id: number; role: Role };
  teams: SiteTeamWithMembers[] | undefined;
}

function DerivationAssignmentControl({
  derivation,
  currentUser,
  teams,
}: DerivationAssignmentControlProps) {
  const claim = useClaimDerivation();
  const assignUser = useAssignDerivationUser();
  const memberTeamIds = teams?.map((team) => team.id) ?? [];
  const action = getAssignmentAction(derivation, currentUser, memberTeamIds);
  const isMine = derivation.userId === currentUser.id;

  const openLink = (
    <Button asChild variant="outline" className="w-full sm:w-auto">
      <Link href={`${COMPLETE_PATH}/${derivation.id}`}>Ouvrir</Link>
    </Button>
  );

  if (action === 'claim') {
    return (
      <Button
        className="w-full sm:w-auto"
        disabled={claim.isPending}
        onClick={() => claim.mutate(derivation.id)}
      >
        M&apos;attribuer
      </Button>
    );
  }

  if (action === 'open') return openLink;

  if (action === 'assign') {
    const options = withCurrentAssignee(
      getTeamMembers(teams, derivation.teamId),
      derivation.user
    );

    return (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <NativeSelect
          aria-label={`Attribuer la dérivation ${derivation.id}`}
          className="sm:w-auto"
          value={derivation.userId ?? ''}
          disabled={assignUser.isPending}
          onChange={(event) =>
            assignUser.mutate({
              derivationId: derivation.id,
              userId:
                event.target.value === '' ? null : Number(event.target.value),
            })
          }
        >
          <option value="">Non attribuée</option>
          {options.map((member) => (
            <option key={member.id} value={member.id}>
              {member.id === currentUser.id
                ? `${formatMemberName(member)} (moi)`
                : formatMemberName(member)}
            </option>
          ))}
        </NativeSelect>
        {isMine && openLink}
      </div>
    );
  }

  return null;
}
