import { User } from '@prisma/client';

export class UsersGroup {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
}
