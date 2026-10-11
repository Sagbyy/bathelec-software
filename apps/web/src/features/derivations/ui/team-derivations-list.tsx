'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Derivation, Role } from '@repo/types';
import { Button } from '@/shared/ui/button';
import { DerivationStatusIcon } from '@/entities/derivation';
import { useUserStore } from '@/entities/user';
import {
  formatMemberName,
  getTeamMembers,
  siteTeamQueries,
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
  if (isLoading) return <p className="p-8">Chargement...</p>;
  if (error) return <p className="p-8">Une erreur est survenue</p>;
  if (!derivations?.length) {
    return <p className="p-8 text-gray-500">Aucune dérivation à traiter.</p>;
  }

  return (
    <ul className="divide-y rounded-2xl border border-gray-200 bg-white">
      {derivations.map((derivation) => (
        <li
          key={derivation.id}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-gray-900">
              {derivation.chantier?.address ?? `Dérivation #${derivation.id}`}
            </span>
            <span className="text-sm text-gray-500">
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
  const action = getAssignmentAction(derivation, currentUser);

  if (action === 'claim') {
    return (
      <Button
        disabled={claim.isPending}
        onClick={() => claim.mutate(derivation.id)}
      >
        M&apos;attribuer
      </Button>
    );
  }

  const openLink = (
    <Button asChild variant="outline">
      <Link href={`${COMPLETE_PATH}/${derivation.id}`}>Ouvrir</Link>
    </Button>
  );

  if (action === 'open') return openLink;

  if (action === 'assign') {
    return (
      <div className="flex items-center gap-2">
        <select
          aria-label={`Attribuer la dérivation ${derivation.id}`}
          className="border-input bg-background h-10 rounded-md border px-3 text-sm"
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
          {getTeamMembers(teams, derivation.teamId).map((member) => (
            <option key={member.id} value={member.id}>
              {member.id === currentUser.id
                ? `${formatMemberName(member)} (moi)`
                : formatMemberName(member)}
            </option>
          ))}
        </select>
        {derivation.userId === currentUser.id && openLink}
      </div>
    );
  }

  return null;
}
