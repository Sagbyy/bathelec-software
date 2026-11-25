import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateOfficialDocumentDto } from './create-official-document.dto';
import { UpdateOfficialDocumentDto } from './update-official-document.dto';

const IMAGE = 'data:image/png;base64,iVBORw0KGgo=';

const invalidPropertiesOf = async (
  dtoClass: typeof UpdateOfficialDocumentDto | typeof CreateOfficialDocumentDto,
  payload: object
) => {
  const errors = await validate(plainToInstance(dtoClass, payload));
  return errors.map((error) => error.property);
};

describe('UpdateOfficialDocumentDto', () => {
  it('rejects clearing the validity date while keeping the document', async () => {
    expect(
      await invalidPropertiesOf(UpdateOfficialDocumentDto, {
        btpCardExpiresAt: null,
      })
    ).toEqual(['btpCardExpiresAt']);
  });

  it('accepts removing the document together with its date', async () => {
    expect(
      await invalidPropertiesOf(UpdateOfficialDocumentDto, {
        btpCard: null,
        btpCardExpiresAt: null,
      })
    ).toEqual([]);
  });

  it('accepts updating only the validity date', async () => {
    expect(
      await invalidPropertiesOf(UpdateOfficialDocumentDto, {
        idCardExpiresAt: '2028-01-15',
      })
    ).toEqual([]);
  });

  it('accepts a partial update that leaves the other documents untouched', async () => {
    expect(
      await invalidPropertiesOf(UpdateOfficialDocumentDto, {
        mutualCard: IMAGE,
        mutualCardExpiresAt: '2028-01-15',
      })
    ).toEqual([]);
  });

  it('rejects a new document without validity date', async () => {
    expect(
      await invalidPropertiesOf(UpdateOfficialDocumentDto, { idCard: IMAGE })
    ).toEqual(['idCardExpiresAt']);
  });
});

describe('CreateOfficialDocumentDto', () => {
  it('rejects clearing the validity date while keeping the document', async () => {
    expect(
      await invalidPropertiesOf(CreateOfficialDocumentDto, {
        mutualCardExpiresAt: null,
      })
    ).toEqual(['mutualCardExpiresAt']);
  });
});
