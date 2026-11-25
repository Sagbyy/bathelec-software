import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isAcceptedReportPhoto, REPORT_PHOTO_ERROR_MESSAGE } from '@repo/types';
import { registerBase64Decorator } from '../../common/validators/base64-file';

@ValidatorConstraint({ name: 'isReportPhoto', async: false })
export class IsReportPhotoConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return isAcceptedReportPhoto(value);
  }

  defaultMessage(): string {
    return REPORT_PHOTO_ERROR_MESSAGE;
  }
}

export function IsReportPhoto(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerBase64Decorator(
      object,
      propertyName,
      validationOptions,
      IsReportPhotoConstraint
    );
  };
}
