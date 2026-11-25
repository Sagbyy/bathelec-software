import {
  CircuitBreakerType,
  VoltageType,
  type CompletedDerivation,
} from '@repo/types';
import type { CircuitBreakerPower } from '@/entities/derivation';

const toIsoDateTime = (dateTime: string | Date | number) => {
  if (typeof dateTime === 'string') {
    return dateTime;
  }
  return new Date(dateTime).toISOString();
};

export const formatCompletedDerivation = (
  completedDerivation: CompletedDerivation
) => {
  const formattedDateTime = toIsoDateTime(
    completedDerivation.generalInfo.dateTime
  );

  return {
    clientInfo: completedDerivation.clientInfo,
    generalInfo: {
      ...completedDerivation.generalInfo,
      dateTime: formattedDateTime,
    },
    photoBeforeWork: completedDerivation.photoBeforeWork,
    oldMeter: {
      ...completedDerivation.oldMeter,
      linkyRefusal: completedDerivation.oldMeter.linkyRefusal ?? false,
      indexPhoto: completedDerivation.oldMeter.indexPhoto ?? null,
    },
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
    photoAfterWork: {
      photo: completedDerivation.photoAfterWork.photo,
      secondPhoto: completedDerivation.photoAfterWork.secondPhoto ?? null,
      thirdPhoto: completedDerivation.photoAfterWork.thirdPhoto ?? null,
    },
    clientValidation: {
      ...completedDerivation.clientValidation,
      technicianNothingToReport:
        completedDerivation.clientValidation.technicianNothingToReport ?? false,
      technicianSignature:
        completedDerivation.clientValidation.technicianSignature ?? null,
    },
  };
};
