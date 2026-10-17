import { CircuitBreakerType, VoltageType } from '@repo/types';
import { CompletedDerivation } from '@repo/types';
import type { CircuitBreakerPower } from '@/entities/derivation';

export const formatCompletedDerivation = (
  completedDerivation: CompletedDerivation
) => {
  const dateTime = completedDerivation.generalInfo.dateTime;
  const formattedDateTime =
    typeof dateTime === 'string'
      ? dateTime
      : dateTime instanceof Date
        ? dateTime.toISOString()
        : new Date(dateTime).toISOString();

  return {
    clientInfo: completedDerivation.clientInfo,
    generalInfo: {
      ...completedDerivation.generalInfo,
      dateTime: formattedDateTime,
    },
    photoBeforeWork: completedDerivation.photoBeforeWork,
    oldMeter: completedDerivation.oldMeter,
    newDerivation: completedDerivation.newDerivation,
    newMeter: completedDerivation.newMeter,
    circuitBreaker: {
      ...completedDerivation.circuitBreaker,
      type: completedDerivation.circuitBreaker.type as CircuitBreakerType,
      voltage: completedDerivation.circuitBreaker.voltage as VoltageType,
      power: completedDerivation.circuitBreaker.power as CircuitBreakerPower,
      testButton: completedDerivation.circuitBreaker.testButton ?? null,
      replacementExplanation:
        completedDerivation.circuitBreaker.replacementExplanation ?? '',
    },
    photoAfterWork: completedDerivation.photoAfterWork,
    clientValidation: completedDerivation.clientValidation,
  };
};
