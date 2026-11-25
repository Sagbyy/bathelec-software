import {
  isAcceptedReportPhoto,
  isAcceptedReportPhotoType,
  REPORT_PHOTO_ERROR_MESSAGE,
  REPORT_PHOTO_MAX_BYTES,
  REPORT_PHOTO_MIME_TYPES,
} from '@repo/types';

export const REPORT_PHOTO_ACCEPT_ATTRIBUTE = REPORT_PHOTO_MIME_TYPES.join(',');

export const REPORT_PHOTO_REQUIRED_MESSAGE = 'La photo est requise';

export function getReportPhotoFileError(file: File): string | null {
  if (!isAcceptedReportPhotoType(file.type)) {
    return REPORT_PHOTO_ERROR_MESSAGE;
  }

  return file.size > REPORT_PHOTO_MAX_BYTES ? REPORT_PHOTO_ERROR_MESSAGE : null;
}

export const isMissingPhoto = (value: unknown) =>
  value === null || value === undefined || value === '';

export const isValidStoredPhoto = (value: unknown) =>
  isAcceptedReportPhoto(value);
