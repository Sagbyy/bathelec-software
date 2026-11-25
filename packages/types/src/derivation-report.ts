export const REPORT_PHOTO_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const REPORT_PHOTO_MAX_BYTES = 5 * 1024 * 1024;

export const REPORT_MAX_ADDITIONAL_PHOTOS = 2;

export const REPORT_PHOTO_ERROR_MESSAGE =
  'La photo doit être au format JPEG, PNG ou WebP et ne pas dépasser 5 Mo';

const DATA_URL_PATTERN = /^data:([a-z]+\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/]+={0,2})$/;

export const isAcceptedReportPhotoType = (mimeType: string) =>
  (REPORT_PHOTO_MIME_TYPES as readonly string[]).includes(mimeType);

const decodedByteLength = (base64: string) => {
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
};

export const isAcceptedReportPhoto = (value: unknown): boolean => {
  if (typeof value !== 'string') {
    return false;
  }

  const match = DATA_URL_PATTERN.exec(value);
  if (!match) {
    return false;
  }

  const [, mimeType, base64] = match;
  return (
    isAcceptedReportPhotoType(mimeType!) &&
    decodedByteLength(base64!) <= REPORT_PHOTO_MAX_BYTES
  );
};

export interface OldMeterOutcome {
  preserved?: boolean | null;
  linkyRefusal?: boolean | null;
}

export const isNewMeterInstalled = (oldMeter: OldMeterOutcome) =>
  !oldMeter.preserved && !oldMeter.linkyRefusal;
