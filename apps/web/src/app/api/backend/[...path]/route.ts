import { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/shared/config/access-control';
import { proxyToApi } from '@/shared/api/proxy-to-api';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: { path: string[] };
}

function handle(request: NextRequest, { params }: RouteContext) {
  return proxyToApi(request, {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
    pathSegments: params.path,
    token: request.cookies.get(SESSION_COOKIE_NAME)?.value,
  });
}

export {
  handle as GET,
  handle as POST,
  handle as PUT,
  handle as PATCH,
  handle as DELETE,
};
