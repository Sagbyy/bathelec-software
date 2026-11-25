import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

const validUser = {
  username: 'jdupont',
  password: 'Bathelec#2026',
  email: 'jean.dupont@bathelec.fr',
  firstName: 'Jean',
  lastName: 'Dupont',
};

const errorsFor = async (body: object) =>
  validate(plainToInstance(CreateUserDto, body));

describe('CreateUserDto', () => {
  it('accepts a complete account with a strong password', async () => {
    await expect(errorsFor(validUser)).resolves.toHaveLength(0);
  });

  it.each([
    ['too short', 'Ab1!xyz'],
    ['without uppercase', 'bathelec#2026'],
    ['without lowercase', 'BATHELEC#2026'],
    ['without digit', 'Bathelec#abcd'],
    ['without special character', 'Bathelec2026'],
  ])('rejects a password %s', async (_case, password) => {
    const errors = await errorsFor({ ...validUser, password });

    expect(errors.map((error) => error.property)).toEqual(['password']);
  });

  it('accepts any non alphanumeric character as special character', async () => {
    await expect(
      errorsFor({ ...validUser, password: 'Bathelec_2026' })
    ).resolves.toHaveLength(0);
  });

  it('rejects an invalid email', async () => {
    const errors = await errorsFor({ ...validUser, email: 'not-an-email' });

    expect(errors.map((error) => error.property)).toEqual(['email']);
  });

  it.each([['username'], ['firstName'], ['lastName']])(
    'rejects an empty %s',
    async (field) => {
      const errors = await errorsFor({ ...validUser, [field]: '' });

      expect(errors.map((error) => error.property)).toEqual([field]);
    }
  );
});
