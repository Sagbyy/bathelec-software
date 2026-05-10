import { User } from '@repo/types';
import { jwtDecode } from 'jwt-decode';

export default function getUsernameByToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const tokenDecoded = jwtDecode<User>(token);

  return tokenDecoded.username;
}
