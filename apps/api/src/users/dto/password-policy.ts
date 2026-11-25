import { Matches } from 'class-validator';
import { PASSWORD_POLICY_PATTERN } from '@repo/types';

export const PASSWORD_POLICY_MESSAGE =
  'password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a digit and a special character';

export const IsStrongPassword = () =>
  Matches(PASSWORD_POLICY_PATTERN, { message: PASSWORD_POLICY_MESSAGE });
