import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Role, ROLE_VALUES } from '@repo/types';
import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
  it('accepts each known role value', async () => {
    for (const role of ROLE_VALUES) {
      const dto = plainToInstance(UpdateUserDto, { role });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('accepts the two new roles positioned under admin', async () => {
    for (const role of [Role.SUPERVISOR, Role.SITE_MANAGER]) {
      const dto = plainToInstance(UpdateUserDto, { role });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('rejects an unknown role', async () => {
    const dto = plainToInstance(UpdateUserDto, { role: 'superadmin' });
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('role');
  });

  it('allows the role to be omitted', async () => {
    const dto = plainToInstance(UpdateUserDto, { username: 'john.doe' });
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });
});
