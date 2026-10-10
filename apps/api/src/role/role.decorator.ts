import { SetMetadata } from '@nestjs/common';

export const ROLE_METADATA_KEY = 'role';

export const Role = (...roles: string[]) =>
  SetMetadata(ROLE_METADATA_KEY, roles);
