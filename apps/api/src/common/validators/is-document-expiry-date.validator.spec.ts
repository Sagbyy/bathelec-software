import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  IsDocumentExpiryDate,
  clearExpiryOfRemovedDocuments,
} from './is-document-expiry-date.validator';

class SampleDto {
  idCard?: string | null;

  @IsDocumentExpiryDate('idCard')
  idCardExpiresAt?: string | null;
}

const errorsFor = async (payload: object) =>
  validate(plainToInstance(SampleDto, payload));

describe('IsDocumentExpiryDate', () => {
  it('requires the expiry date when the document is provided', async () => {
    const errors = await errorsFor({ idCard: 'data:image/png;base64,AAA' });

    expect(errors[0]?.property).toBe('idCardExpiresAt');
  });

  it('accepts a document with a valid expiry date', async () => {
    expect(
      await errorsFor({
        idCard: 'data:image/png;base64,AAA',
        idCardExpiresAt: '2027-05-31',
      })
    ).toHaveLength(0);
  });

  it('rejects an invalid expiry date', async () => {
    const errors = await errorsFor({ idCardExpiresAt: 'bientôt' });

    expect(errors[0]?.property).toBe('idCardExpiresAt');
  });

  it('accepts updating the expiry date alone', async () => {
    expect(await errorsFor({ idCardExpiresAt: '2027-05-31' })).toHaveLength(0);
  });

  it('accepts removing the document without a date', async () => {
    expect(
      await errorsFor({ idCard: null, idCardExpiresAt: null })
    ).toHaveLength(0);
  });
});

describe('clearExpiryOfRemovedDocuments', () => {
  it('clears the expiry date of removed documents only', () => {
    expect(
      clearExpiryOfRemovedDocuments(
        { idCard: null, btpCard: 'data', btpCardExpiresAt: '2027-01-01' },
        ['idCard', 'btpCard', 'mutualCard']
      )
    ).toEqual({
      idCard: null,
      idCardExpiresAt: null,
      btpCard: 'data',
      btpCardExpiresAt: '2027-01-01',
    });
  });
});
