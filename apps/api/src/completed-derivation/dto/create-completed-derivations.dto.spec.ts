import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCompletedDerivationDto } from './create-completed-derivations.dto';

const PHOTO = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';

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
  photoBeforeWork: { photo: PHOTO },
  oldMeter: {
    type: 'linky',
    generation: 'g1',
    preserved: false,
    serialNumber: '123456789012',
    key: '34',
    dayIndex: '1000',
    nightIndex: '2000',
    indexPhoto: PHOTO,
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
    indexPhoto: PHOTO,
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
  photoAfterWork: { photo: PHOTO },
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

const validationErrors = async (payload: unknown) => {
  const dto = plainToInstance(CreateCompletedDerivationDto, payload);
  return validate(dto);
};

const errorsOf = async (property: string, payload: unknown) =>
  JSON.stringify(
    (await validationErrors(payload)).find(
      (error) => error.property === property
    )?.children ?? []
  );

describe('CreateCompletedDerivationDto full payload', () => {
  it('accepts the valid payload', async () => {
    expect(await validationErrors(validPayload)).toEqual([]);
  });
});

describe('CreateCompletedDerivationDto client presence (RG-10)', () => {
  const withClient = (clientValidation: Record<string, unknown>) =>
    errorsOf('clientValidation', {
      ...validPayload,
      clientValidation: {
        ...validPayload.clientValidation,
        ...clientValidation,
      },
    });

  it('accepts an absent client without signature, validation nor satisfaction', async () => {
    expect(
      await withClient({
        present: false,
        signature: null,
        workValidation: undefined,
        satisfactionLevel: undefined,
        clientComment: undefined,
      })
    ).toBe('[]');
  });

  it('requires the client signature when the client is present', async () => {
    expect(await withClient({ present: true, signature: null })).toContain(
      'signature'
    );
    expect(await withClient({ present: true, signature: '' })).toContain(
      'signature'
    );
  });

  it('rejects a satisfaction level outside 0 to 4 when the client is present', async () => {
    expect(await withClient({ satisfactionLevel: '5' })).toContain(
      'satisfactionLevel'
    );
  });
});

describe('CreateCompletedDerivationDto sealing (RG-06)', () => {
  it('rejects an unsealed circuit breaker', async () => {
    expect(
      await errorsOf('circuitBreaker', {
        ...validPayload,
        circuitBreaker: { ...validPayload.circuitBreaker, sealed: false },
      })
    ).toContain('sealed');
  });
});

describe('CreateCompletedDerivationDto photos (RG-09)', () => {
  it.each([
    ['photoBeforeWork', { photo: undefined }],
    ['photoBeforeWork', { photo: 'data:image/gif;base64,R0lGODlh' }],
    ['photoBeforeWork', { photo: 'https://example.com/photo.jpg' }],
    ['photoAfterWork', { photo: null }],
  ])('rejects a missing or invalid %s photo (%j)', async (property, value) => {
    expect(
      await errorsOf(property, { ...validPayload, [property]: value })
    ).toContain('photo');
  });

  it('rejects a photo larger than 5 MB', async () => {
    const oversized = `data:image/png;base64,${'A'.repeat(7 * 1024 * 1024)}`;

    expect(
      await errorsOf('photoBeforeWork', {
        ...validPayload,
        photoBeforeWork: { photo: oversized },
      })
    ).toContain('photo');
  });

  it.each(['image/jpeg', 'image/png', 'image/webp'])(
    'accepts a %s photo',
    async (mimeType) => {
      expect(
        await errorsOf('photoBeforeWork', {
          ...validPayload,
          photoBeforeWork: { photo: `data:${mimeType};base64,AAAA` },
        })
      ).toBe('[]');
    }
  );

  it('accepts two additional photos after work', async () => {
    expect(
      await errorsOf('photoAfterWork', {
        ...validPayload,
        photoAfterWork: {
          photo: PHOTO,
          secondPhoto: PHOTO,
          thirdPhoto: PHOTO,
        },
      })
    ).toBe('[]');
  });

  it('rejects a third additional photo after work', async () => {
    expect(
      await errorsOf('photoAfterWork', {
        ...validPayload,
        photoAfterWork: {
          photo: PHOTO,
          secondPhoto: PHOTO,
          thirdPhoto: PHOTO,
          fourthPhoto: PHOTO,
        },
      })
    ).toContain('fourthPhoto');
  });

  it('requires the old meter index photo when the meter is replaced', async () => {
    expect(
      await errorsOf('oldMeter', {
        ...validPayload,
        oldMeter: { ...validPayload.oldMeter, indexPhoto: null },
      })
    ).toContain('indexPhoto');
  });

  it('does not require the old meter index photo when the meter is preserved', async () => {
    expect(
      await errorsOf('oldMeter', {
        ...validPayload,
        oldMeter: {
          ...validPayload.oldMeter,
          preserved: true,
          indexPhoto: null,
        },
      })
    ).toBe('[]');
  });

  it('requires the new meter index photo when a new meter is installed', async () => {
    expect(
      await errorsOf('newMeter', {
        ...validPayload,
        newMeter: { ...validPayload.newMeter, indexPhoto: null },
      })
    ).toContain('indexPhoto');
  });

  it.each([
    { preserved: true, linkyRefusal: false },
    { preserved: false, linkyRefusal: true },
  ])('skips the new meter when no meter is installed (%j)', async (outcome) => {
    const errors = await validationErrors({
      ...validPayload,
      oldMeter: { ...validPayload.oldMeter, ...outcome },
      newMeter: { generation: '', indexPhoto: null },
    });

    expect(
      errors.find((error) => error.property === 'newMeter')
    ).toBeUndefined();
  });
});

describe('CreateCompletedDerivationDto client submission id (ENF-08)', () => {
  const submissionIdErrors = async (clientSubmissionId: unknown) =>
    (await validationErrors({ ...validPayload, clientSubmissionId })).find(
      (error) => error.property === 'clientSubmissionId'
    );

  it('accepts a payload without submission id', async () => {
    expect(await submissionIdErrors(undefined)).toBeUndefined();
  });

  it('accepts a UUID submission id', async () => {
    expect(
      await submissionIdErrors('3f0c8a52-6a0e-4d3c-9f8e-2b1d5c7e9a10')
    ).toBeUndefined();
  });

  it('rejects a submission id that is not a UUID', async () => {
    expect(await submissionIdErrors('not-a-uuid')).toBeDefined();
  });
});
