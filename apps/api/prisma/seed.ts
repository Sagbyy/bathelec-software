import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const STATUSES = [
  'Pending',
  'Ongoing',
  'Reviewing',
  'Revising',
  'Incorrect',
  'Completed',
] as const;

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomStatus() {
  return STATUSES[Math.floor(Math.random() * STATUSES.length)];
}

const MARKETS = [{ name: 'DR Paris' }, { name: 'DR Île-de-France' }];

const CHANTIERS_BY_MARKET: Record<
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

async function main() {
  const technicianUser = await prisma.user.findFirst({
    where: { role: 'technician' },
    select: { id: true },
  });

  if (!technicianUser) {
    throw new Error('No technician user found in DB. Create one first.');
  }

  const userId = technicianUser.id;

  console.log(`\nUsing technician userId: ${userId}`);

  let totalChantiers = 0;
  let totalDerivations = 0;

  for (const marketData of MARKETS) {
    const market = await prisma.market.upsert({
      where: { name: marketData.name },
      update: {},
      create: { name: marketData.name },
    });

    console.log(`\n📦 Market: ${market.name} (id: ${market.id})`);

    const chantiersData = CHANTIERS_BY_MARKET[marketData.name] ?? [];

    for (const chantierData of chantiersData) {
      const chantier = await prisma.chantier.upsert({
        where: {
          // upsert by composite of enedis number (unique enough)
          id:
            (
              await prisma.chantier.findFirst({
                where: {
                  enedisAffaireNumber: chantierData.enedisAffaireNumber,
                },
                select: { id: true },
              })
            )?.id ?? 0,
        },
        update: {},
        create: {
          address: chantierData.address,
          enedisAffaireNumber: chantierData.enedisAffaireNumber,
          internalAffaireNumber: chantierData.internalAffaireNumber,
          marketId: market.id,
        },
      });

      const count = randomBetween(1, 10);
      console.log(
        `  🏗  Chantier: ${chantier.address} → ${count} dérivation(s)`
      );

      for (let i = 0; i < count; i++) {
        await prisma.derivation.create({
          data: {
            userId,
            chantierId: chantier.id,
            status: randomStatus(),
            correctionComment: null,
          },
        });
      }

      totalChantiers++;
      totalDerivations += count;
    }
  }

  console.log(`\n✅ Seeded:`);
  console.log(`   ${MARKETS.length} marchés`);
  console.log(`   ${totalChantiers} chantiers`);
  console.log(`   ${totalDerivations} dérivations`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
