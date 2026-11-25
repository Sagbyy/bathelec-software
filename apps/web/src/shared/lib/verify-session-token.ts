import { jwtVerify } from 'jose';
import { Role, ROLE_VALUES } from '@repo/types';

export interface Session {
  userId: number;
  role: Role;
}

const isRole = (value: unknown): value is Role =>
  ROLE_VALUES.includes(value as Role);

export async function verifySessionToken(
  token: string | undefined,
  secret: string | undefined
): Promise<Session | null> {
  if (!token || !secret) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { algorithms: ['HS256'] }
    );
    if (!isRole(payload.role)) return null;
    return { userId: Number(payload.sub), role: payload.role };
  } catch {
    return null;
  }
}
