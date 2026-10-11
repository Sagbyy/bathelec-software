'use client';

import { useQuery } from '@tanstack/react-query';
import { Derivation } from '@repo/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useUserStore } from '@/entities/user';
import { NativeSelect } from '@/shared/ui/native-select';
import {
  formatMemberName,
  getTeamMembers,
  siteTeamQueries,
  withCurrentAssignee,
} from '@/entities/site-team';
import {
  useAssignDerivationTeam,
  useAssignDerivationUser,
} from '../model/use-derivation-assignment';

interface DerivationTeamCardProps {
  derivation: Derivation;
}

export function DerivationTeamCard({ derivation }: DerivationTeamCardProps) {
  const { user } = useUserStore();
  const { data: teams, isLoading } = useQuery(
    siteTeamQueries.visibleTo(user?.role)
  );
  const assignTeam = useAssignDerivationTeam(derivation.id);
  const assignUser = useAssignDerivationUser();
  const members = withCurrentAssignee(
    getTeamMembers(teams, derivation.teamId),
    derivation.user
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Attribution</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Équipe chantier
          <NativeSelect
            value={derivation.teamId ?? ''}
            disabled={isLoading || assignTeam.isPending}
            onChange={(event) => assignTeam.mutate(Number(event.target.value))}
          >
            {derivation.teamId === null && (
              <option value="" disabled>
                Aucune équipe
              </option>
            )}
            {teams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </NativeSelect>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Technicien
          <NativeSelect
            value={derivation.userId ?? ''}
            disabled={derivation.teamId === null || assignUser.isPending}
            onChange={(event) =>
              assignUser.mutate({
                derivationId: derivation.id,
                userId:
                  event.target.value === '' ? null : Number(event.target.value),
              })
            }
          >
            <option value="">Non attribuée</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {formatMemberName(member)}
              </option>
            ))}
          </NativeSelect>
        </label>
      </CardContent>
    </Card>
  );
}
