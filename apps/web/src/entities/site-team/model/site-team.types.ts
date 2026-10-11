import { Role } from '@repo/types';

export interface SiteTeamMember {
  id: number;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface SiteTeamWithMembers {
  id: number;
  name: string;
  teamMemberships: Array<{ user: SiteTeamMember }>;
}
