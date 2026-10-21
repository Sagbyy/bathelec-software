import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

export type ExpiryMail = {
  recipients: string[];
  technicianName: string;
  documentLabel: string;
  expiresAt: Date;
  remainingDays: number;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);

export const buildExpiryMail = ({
  technicianName,
  documentLabel,
  expiresAt,
  remainingDays,
}: ExpiryMail) => {
  const subject = `[Abrisûr] ${documentLabel} de ${technicianName} expire dans ${remainingDays} jour(s)`;
  const text = [
    'Bonjour,',
    '',
    `Le document « ${documentLabel} » de ${technicianName} arrive à expiration le ${formatDate(expiresAt)} (dans ${remainingDays} jour(s)).`,
    'Merci de prévoir son renouvellement et de confirmer la prise de connaissance de cette information dans l’application.',
    '',
    'Abrisûr Software',
  ].join('\n');
  return { subject, text };
};

@Injectable()
export class ExpiryMailerService {
  private readonly logger = new Logger(ExpiryMailerService.name);
  private readonly transporter: Transporter | null;
  private readonly from: string;

  constructor(config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');
    this.from = config.get<string>('MAIL_FROM') ?? 'no-reply@bathelec.fr';
    this.transporter = host
      ? createTransport({
          host,
          port: Number(config.get<string>('SMTP_PORT') ?? 587),
          secure: config.get<string>('SMTP_SECURE') === 'true',
          auth: config.get<string>('SMTP_USER')
            ? {
                user: config.get<string>('SMTP_USER'),
                pass: config.get<string>('SMTP_PASSWORD'),
              }
            : undefined,
        })
      : null;
  }

  async send(mail: ExpiryMail) {
    if (mail.recipients.length === 0) return;
    if (!this.transporter) {
      this.logger.warn(
        'SMTP_HOST is not configured, expiry e-mail skipped (in-app notification kept)'
      );
      return;
    }
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: mail.recipients,
        ...buildExpiryMail(mail),
      });
    } catch (error) {
      this.logger.error(`Expiry e-mail failed: ${(error as Error).message}`);
    }
  }
}
