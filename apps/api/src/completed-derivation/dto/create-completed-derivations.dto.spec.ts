import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCompletedDerivationDto } from './create-completed-derivations.dto';

const validPayload = {
  requestedDerivationId: 1,
  clientInfo: { name: 'Mohamed', phone: '06 06 06 06 06', folio: '123' },
  generalInfo: {
    dateTime: new Date('2025-03-22T22:35:00.622Z'),
    derivationBy: '71',
    address: { street: 'Street 12', postalCode: '75001', city: 'London' },
    building: 'Building 12',
    cmIdentification: '123',
    floor: '1',
    situation: 'Situation 1',
    comment: 'Comment 1',
  },
  photoBeforeWork: { photo: 'photo' },
  oldMeter: {
    type: 'linky',
    generation: 'g1',
    preserved: false,
    serialNumber: '123456789012',
    key: '34',
    dayIndex: '1000',
    nightIndex: '2000',
  },
  newDerivation: {
    section: 'section 1',
    cableType: 'cable type 1',
    length: 100,
  },
  newMeter: {
    generation: 'g1',
    serialNumber: '123456789012',
    key: '34',
    dayIndex: '1000',
    nightIndex: '2000',
    indexPhoto: 'photo',
  },
  circuitBreaker: {
    preserved: false,
    voltage: 'mono',
    brand: 'Schneider',
    type: 'differentiel',
    power: '15-45',
    calibrationPower: '45A',
    commissioningDone: false,
    sealed: true,
  },
  photoAfterWork: { photo: 'photo' },
  clientValidation: {
    present: true,
    workValidation: false,
    satisfactionLevel: '0',
    clientComment: 'Comment 1',
    signature: 'signature',
    technicianComment: 'Comment 1',
  },
};

const circuitBreakerErrors = async (payload: unknown) => {
  const dto = plainToInstance(CreateCompletedDerivationDto, payload);
  const errors = await validate(dto);
  return errors.find((error) => error.property === 'circuitBreaker');
};

describe('CreateCompletedDerivationDto circuit breaker (DTA-44)', () => {
  it('accepts a payload with both breaker and calibration power', async () => {
    expect(await circuitBreakerErrors(validPayload)).toBeUndefined();
  });

  it('rejects a payload missing the calibration power', async () => {
    const { calibrationPower, ...circuitBreaker } = validPayload.circuitBreaker;
    void calibrationPower;

    const error = await circuitBreakerErrors({
      ...validPayload,
      circuitBreaker,
    });

    expect(error).toBeDefined();
    expect(JSON.stringify(error?.children)).toContain('calibrationPower');
  });
});
