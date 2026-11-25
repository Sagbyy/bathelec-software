import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/shared/config/access-control';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  return NextResponse.json({ message: 'Logout successful' });
}
