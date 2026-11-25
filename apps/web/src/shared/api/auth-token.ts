let token: string | null = null;

export const setAuthToken = (t: string | null) => {
  token = t;
};

export const getAuthToken = () => token;

const AUTH_TOKEN_ROUTE = '/api/auth/token';

export const ensureAuthToken = async () => {
  if (token) {
    return token;
  }
  const response = await fetch(AUTH_TOKEN_ROUTE);
  if (!response.ok) {
    return null;
  }
  const data: { accessToken?: string } = await response.json();
  token = data.accessToken ?? null;
  return token;
};
