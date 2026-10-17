import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCompletedDerivationDto } from './create-completed-derivations.dto';

const validPayload = {
  requestedDerivationId: 1,
  clientInfo: {
    name: 'Mohamed',
    phone: '06 06 06 06 06',
    folio: 'SGX001 - COM001 - ASC001 - 001 - 101',
  },
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
    technicianSignature: 'data:image/png;base64,signature',
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

describe('CreateCompletedDerivationDto circuit breaker test button (DTA-49)', () => {
  const withBreaker = (circuitBreaker: Record<string, unknown>) =>
    circuitBreakerErrors({
      ...validPayload,
      circuitBreaker: { ...validPayload.circuitBreaker, ...circuitBreaker },
    });

  it('requires the test button result when the breaker is preserved', async () => {
    const error = await withBreaker({ preserved: true });

    expect(JSON.stringify(error?.children)).toContain('testButton');
  });

  it('accepts a preserved breaker whose test button works', async () => {
    expect(
      await withBreaker({ preserved: true, testButton: 'working' })
    ).toBeUndefined();
  });

  it('requires an explanation when the test button is faulty', async () => {
    const error = await withBreaker({
      preserved: true,
      testButton: 'faulty',
      replacementExplanation: '',
    });

    expect(JSON.stringify(error?.children)).toContain('replacementExplanation');
  });

  it('accepts a faulty test button with an explanation', async () => {
    expect(
      await withBreaker({
        preserved: true,
        testButton: 'faulty',
        replacementExplanation: 'Bouton inopérant, disjoncteur remplacé',
      })
    ).toBeUndefined();
  });

  it('rejects an unknown test button result', async () => {
    const error = await withBreaker({ preserved: true, testButton: 'maybe' });

    expect(JSON.stringify(error?.children)).toContain('testButton');
  });

  it('keeps accepting a replaced breaker without test data', async () => {
    expect(
      await withBreaker({ preserved: false, testButton: null })
    ).toBeUndefined();
  });
});

describe('CreateCompletedDerivationDto technician validation (DTA-60)', () => {
  const clientValidationErrors = async (
    clientValidation: Record<string, unknown>
  ) => {
    const dto = plainToInstance(CreateCompletedDerivationDto, {
      ...validPayload,
      clientValidation: {
        ...validPayload.clientValidation,
        ...clientValidation,
      },
    });
    const errors = await validate(dto);
    return JSON.stringify(
      errors.find((error) => error.property === 'clientValidation')?.children ??
        []
    );
  };

  it('requires the technician comment when RAS is not enabled', async () => {
    expect(await clientValidationErrors({ technicianComment: '' })).toContain(
      'technicianComment'
    );
  });

  it('accepts an empty comment when RAS is enabled', async () => {
    expect(
      await clientValidationErrors({
        technicianComment: '',
        technicianNothingToReport: true,
      })
    ).toBe('[]');
  });

  it('requires the technician signature', async () => {
    expect(await clientValidationErrors({ technicianSignature: '' })).toContain(
      'technicianSignature'
    );
  });

  it('rejects a non boolean RAS toggle', async () => {
    expect(
      await clientValidationErrors({ technicianNothingToReport: 'oui' })
    ).toContain('technicianNothingToReport');
  });
});

describe('CreateCompletedDerivationDto folio format (DTA-63)', () => {
  const clientInfoErrors = async (folio: string) => {
    const dto = plainToInstance(CreateCompletedDerivationDto, {
      ...validPayload,
      clientInfo: { ...validPayload.clientInfo, folio },
    });
    const errors = await validate(dto);
    return JSON.stringify(
      errors.find((error) => error.property === 'clientInfo')?.children ?? []
    );
  };

  it.each([
    'SGX001 - COM001 - ASC001 - 001 - 101',
    'sgx001-com001-asc001-001-101',
    ' SGX001 -COM001- ASC001 - 001 - 101 ',
  ])('accepts the folio %j', async (folio) => {
    expect(await clientInfoErrors(folio)).toBe('[]');
  });

  it.each([
    '1234567890',
    'SGX001 - COM001 - ASC001 - 001',
    'SGX001 - COM001 - ASC001 - 001 - 101 - 9',
    'SGX001 - COM 001 - ASC001 - 001 - 101',
    'SGX001 -  - ASC001 - 001 - 101',
  ])('rejects the folio %j', async (folio) => {
    expect(await clientInfoErrors(folio)).toContain('folio');
  });
});
