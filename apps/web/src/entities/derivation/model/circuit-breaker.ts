export const CIRCUIT_BREAKER_POWERS = [
  '10-30',
  '15-45',
  '30-60',
  '60-90',
  '10',
  '15',
  '20',
  '30',
  '40',
  '50',
  '60',
] as const;

export type CircuitBreakerPower = (typeof CIRCUIT_BREAKER_POWERS)[number];

export const CIRCUIT_BREAKER_TEST_RESULTS = ['working', 'faulty'] as const;

export type CircuitBreakerTestResult =
  (typeof CIRCUIT_BREAKER_TEST_RESULTS)[number];
