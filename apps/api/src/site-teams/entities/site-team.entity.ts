import { User } from '@prisma/client';

export class SiteTeam {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
}
