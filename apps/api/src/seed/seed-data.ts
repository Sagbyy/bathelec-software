export const STATUSES = [
  'Pending',
  'Ongoing',
  'Reviewing',
  'Revising',
  'Incorrect',
  'Completed',
] as const;

export type SeededDerivation = {
  id: number;
  address: string;
  status: (typeof STATUSES)[number];
};

export const SAMPLE_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

export const MARKETS = [{ name: 'DR Paris' }, { name: 'DR Île-de-France' }];

export const CHANTIERS_BY_MARKET: Record<
  string,
  Array<{
    address: string;
    enedisAffaireNumber: string;
    internalAffaireNumber: string;
  }>
> = {
  'DR Paris': [
    {
      address: '3 RUE PAILLET 75005 PARIS',
      enedisAffaireNumber: 'DC21/014312',
      internalAffaireNumber: 'BA570035',
    },
    {
      address: '15 RUE DU FAUBOURG SAINT-ANTOINE 75011 PARIS',
      enedisAffaireNumber: 'DC21/015789',
      internalAffaireNumber: 'BA570042',
    },
    {
      address: '8 AVENUE DE LA REPUBLIQUE 75011 PARIS',
      enedisAffaireNumber: 'DC21/016234',
      internalAffaireNumber: 'BA570051',
    },
    {
      address: '22 RUE DE RIVOLI 75004 PARIS',
      enedisAffaireNumber: 'DC21/017891',
      internalAffaireNumber: 'BA570063',
    },
    {
      address: '5 RUE DES MARTYRS 75009 PARIS',
      enedisAffaireNumber: 'DC21/018445',
      internalAffaireNumber: 'BA570072',
    },
    {
      address: '47 RUE DE LA ROQUETTE 75011 PARIS',
      enedisAffaireNumber: 'DC21/018902',
      internalAffaireNumber: 'BA570081',
    },
  ],
  'DR Île-de-France': [
    {
      address: '12 AVENUE DU GENERAL DE GAULLE 93100 MONTREUIL',
      enedisAffaireNumber: 'DC21/019001',
      internalAffaireNumber: 'BA570085',
    },
    {
      address: '7 RUE VICTOR HUGO 92100 BOULOGNE-BILLANCOURT',
      enedisAffaireNumber: 'DC21/019432',
      internalAffaireNumber: 'BA570094',
    },
    {
      address: '25 BOULEVARD DE LA REPUBLIQUE 93200 SAINT-DENIS',
      enedisAffaireNumber: 'DC21/019876',
      internalAffaireNumber: 'BA570103',
    },
    {
      address: '3 RUE JEAN JAURES 94200 IVRY-SUR-SEINE',
      enedisAffaireNumber: 'DC21/020112',
      internalAffaireNumber: 'BA570115',
    },
    {
      address: '18 AVENUE DU PRESIDENT WILSON 94400 VITRY-SUR-SEINE',
      enedisAffaireNumber: 'DC21/020567',
      internalAffaireNumber: 'BA570128',
    },
    {
      address: '9 RUE DE VERDUN 92300 LEVALLOIS-PERRET',
      enedisAffaireNumber: 'DC21/021034',
      internalAffaireNumber: 'BA570139',
    },
  ],
};

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function parseAddress(fullAddress: string) {
  const postalCodeMatch = fullAddress.match(/\b\d{5}\b/);
  const postalCode = postalCodeMatch?.[0] ?? '75000';
  const [streetPart, cityPart] = postalCodeMatch
    ? fullAddress.split(postalCode)
    : [fullAddress, 'PARIS'];

  return {
    street: streetPart.trim(),
    postalCode,
    city: cityPart.trim() || 'PARIS',
  };
}

export function threeDigitMatricule(value: number) {
  return String(value % 1000).padStart(3, '0');
}

export function buildSeedPhone(requestedDerivationId: number) {
  const forbiddenPhone = '+33783131466';
  const suffix = String(
    (requestedDerivationId * 7919 + 12345678) % 100000000
  ).padStart(8, '0');
  const phone = `+337${suffix}`;

  if (phone === forbiddenPhone) {
    return '+33700000000';
  }

  return phone;
}

export function buildCompletedDerivationData(
  requestedDerivationId: number,
  address: string
) {
  const matricule = threeDigitMatricule(requestedDerivationId);
  const newMatricule = threeDigitMatricule(requestedDerivationId + 500);
  const floor = String((requestedDerivationId % 6) + 1);

  return {
    requestedDerivationId,
    clientInfo: {
      name: 'Client Seed',
      phone: buildSeedPhone(requestedDerivationId),
      folio: `FOLIO-${requestedDerivationId}`,
    },
    generalInfo: {
      dateTime: new Date(),
      derivationBy: 'Technicien Seed',
      address: parseAddress(address),
      building: `Batiment ${String.fromCharCode(
        65 + (requestedDerivationId % 4)
      )}`,
      cmIdentification: `CM-${threeDigitMatricule(requestedDerivationId)}`,
      floor,
      situation: `Appartement ${100 + requestedDerivationId}`,
      comment: 'Donnee de demonstration complete',
    },
    photoBeforeWork: {
      photo: SAMPLE_IMAGE,
    },
    oldMeter: {
      type: 'linky',
      generation: 'g1',
      preserved: false,
      linkyRefusal: false,
      serialNumber: matricule,
      key: '12',
      dayIndex: String(10000 + requestedDerivationId),
      nightIndex: String(5000 + requestedDerivationId),
      indexPhoto: SAMPLE_IMAGE,
    },
    newDerivation: {
      section: '16 mm2',
      cableType: 'aluminium',
      length: randomBetween(4, 18),
    },
    newMeter: {
      generation: 'g3',
      serialNumber: newMatricule,
      dayIndex: '0',
      nightIndex: '0',
      indexPhoto: SAMPLE_IMAGE,
    },
    circuitBreaker: {
      preserved: true,
      voltage: 'mono',
      brand: 'Schneider',
      type: 'selectif',
      power: '60A',
      commissioningDone: true,
      sealed: true,
    },
    photoAfterWork: {
      photo: SAMPLE_IMAGE,
      secondPhoto: SAMPLE_IMAGE,
      thirdPhoto: SAMPLE_IMAGE,
    },
    clientValidation: {
      present: true,
      workValidation: true,
      satisfactionLevel: '5',
      clientComment: 'Travaux valides',
      signature: SAMPLE_IMAGE,
      technicianComment: 'RAS',
    },
  };
}

export function getSeedChantierEnedisNumbers() {
  return Object.values(CHANTIERS_BY_MARKET)
    .flat()
    .map((chantier) => chantier.enedisAffaireNumber);
}
