import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateVehicleDocumentDto } from './update-vehicle-document.dto';

const IMAGE = 'data:image/png;base64,iVBORw0KGgo=';

const invalidPropertiesOf = async (payload: object) => {
  const errors = await validate(
    plainToInstance(UpdateVehicleDocumentDto, payload)
  );
  return errors.map((error) => error.property);
};

describe('UpdateVehicleDocumentDto', () => {
  it('rejects clearing the validity date while keeping the document', async () => {
    expect(
      await invalidPropertiesOf({ drivingLicenseExpiresAt: null })
    ).toEqual(['drivingLicenseExpiresAt']);
  });

  it('accepts removing the document together with its date', async () => {
    expect(
      await invalidPropertiesOf({
        drivingLicense: null,
        drivingLicenseExpiresAt: null,
      })
    ).toEqual([]);
  });

  it('accepts replacing the document with a new validity date', async () => {
    expect(
      await invalidPropertiesOf({
        vehicleRegistration: IMAGE,
        vehicleRegistrationExpiresAt: '2028-01-15',
      })
    ).toEqual([]);
  });

  it('rejects a new document without validity date', async () => {
    expect(await invalidPropertiesOf({ drivingLicense: IMAGE })).toEqual([
      'drivingLicenseExpiresAt',
    ]);
  });

  it('rejects an invalid validity date', async () => {
    expect(
      await invalidPropertiesOf({ vehicleRegistrationExpiresAt: 'demain' })
    ).toEqual(['vehicleRegistrationExpiresAt']);
  });
});
