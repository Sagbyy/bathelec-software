import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ChangePasswordDto } from './change-password.dto';

const errorsFor = async (body: object) =>
  validate(plainToInstance(ChangePasswordDto, body));

describe('ChangePasswordDto', () => {
  it('accepts a strong new password', async () => {
    await expect(
      errorsFor({ currentPassword: 'old', newPassword: 'Bathelec#2026' })
    ).resolves.toHaveLength(0);
  });

  it('rejects a weak new password (EF-AUTH-05)', async () => {
    const errors = await errorsFor({
      currentPassword: 'old',
      newPassword: 'ab',
    });

    expect(errors.map((error) => error.property)).toEqual(['newPassword']);
  });

  it('requires the current password', async () => {
    const errors = await errorsFor({
      currentPassword: '',
      newPassword: 'Bathelec#2026',
    });

    expect(errors.map((error) => error.property)).toEqual(['currentPassword']);
  });
});
