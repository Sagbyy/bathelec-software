const REQUEST_HEADERS_NOT_FORWARDED = [
  'host',
  'connection',
  'content-length',
  'cookie',
  'authorization',
  'accept-encoding',
];

const RESPONSE_HEADERS_NOT_FORWARDED = [
  'connection',
  'content-encoding',
  'content-length',
  'transfer-encoding',
];

const METHODS_WITHOUT_BODY = ['GET', 'HEAD'];

export function buildUpstreamUrl(
  apiBaseUrl: string,
  pathSegments: string[],
  search: string
): string {
  const base = apiBaseUrl.replace(/\/+$/, '');
  const path = pathSegments.map(encodeURIComponent).join('/');
  return `${base}/${path}${search}`;
}

function buildUpstreamHeaders(request: Request, token: string | undefined) {
  const headers = new Headers(request.headers);
  REQUEST_HEADERS_NOT_FORWARDED.forEach((name) => headers.delete(name));
  if (token) headers.set('authorization', `Bearer ${token}`);
  return headers;
}

function buildResponseHeaders(upstream: Response) {
  const headers = new Headers(upstream.headers);
  RESPONSE_HEADERS_NOT_FORWARDED.forEach((name) => headers.delete(name));
  return headers;
}

export interface ProxyToApiOptions {
  apiBaseUrl: string;
  pathSegments: string[];
  token: string | undefined;
}

export async function proxyToApi(
  request: Request,
  { apiBaseUrl, pathSegments, token }: ProxyToApiOptions
): Promise<Response> {
  const hasBody = !METHODS_WITHOUT_BODY.includes(request.method);
  const upstream = await fetch(
    buildUpstreamUrl(apiBaseUrl, pathSegments, new URL(request.url).search),
    {
      method: request.method,
      headers: buildUpstreamHeaders(request, token),
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: 'manual',
      cache: 'no-store',
    }
  );

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: buildResponseHeaders(upstream),
  });
}
