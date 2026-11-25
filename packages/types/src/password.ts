export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_RULES = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  digit: /\d/,
  special: /[^A-Za-z0-9]/,
} as const;

export const PASSWORD_POLICY_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const isStrongPassword = (value: string) =>
  PASSWORD_POLICY_PATTERN.test(value);
