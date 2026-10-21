import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { ExpiryMailerService, buildExpiryMail } from './expiry-mailer.service';

jest.mock('nodemailer', () => ({ createTransport: jest.fn() }));

const mail = {
  recipients: ['tech@bathelec.fr', 'admin@bathelec.fr'],
  technicianName: 'Jean Tech',
  documentLabel: 'Permis de conduire',
  expiresAt: new Date('2026-11-16T00:00:00.000Z'),
  remainingDays: 30,
};

const configWith = (values: Record<string, string>) =>
  ({ get: (key: string) => values[key] }) as unknown as ConfigService;

describe('ExpiryMailerService', () => {
  const sendMail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(createTransport).mockReturnValue({ sendMail } as never);
  });

  it('builds a French e-mail with the document and the deadline', () => {
    const { subject, text } = buildExpiryMail(mail);

    expect(subject).toBe(
      '[Abrisûr] Permis de conduire de Jean Tech expire dans 30 jour(s)'
    );
    expect(text).toContain('16 novembre 2026');
  });

  it('sends the e-mail to every recipient through SMTP', async () => {
    const mailer = new ExpiryMailerService(
      configWith({
        SMTP_HOST: 'smtp.example.com',
        MAIL_FROM: 'app@bathelec.fr',
      })
    );

    await mailer.send(mail);

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'app@bathelec.fr',
        to: mail.recipients,
      })
    );
  });

  it('skips the e-mail when SMTP is not configured', async () => {
    const mailer = new ExpiryMailerService(configWith({}));

    await mailer.send(mail);

    expect(createTransport).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('does not throw when the SMTP server fails', async () => {
    sendMail.mockRejectedValue(new Error('timeout'));
    const mailer = new ExpiryMailerService(
      configWith({ SMTP_HOST: 'smtp.example.com' })
    );

    await expect(mailer.send(mail)).resolves.toBeUndefined();
  });
});
