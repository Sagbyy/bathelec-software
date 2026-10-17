import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExpiryNotificationsService } from './expiry-notifications.service';

@Injectable()
export class ExpiryNotificationsScheduler {
  constructor(private readonly notifications: ExpiryNotificationsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_7AM, { timeZone: 'Europe/Paris' })
  runDailyScan() {
    return this.notifications.scan();
  }
}
