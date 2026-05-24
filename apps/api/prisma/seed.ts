import { resolve } from 'node:path';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import * as mongoose from 'mongoose';
import {
  CompletedDerivation,
  CompletedDerivationSchema,
} from '../src/completed-derivation/entities/completed-derivations.entity';
import {
  Habilitation,
  HabilitationSchema,
} from '../src/habilitations/entities/habilitation.entity';
import {
  OfficialDocument,
  OfficialDocumentSchema,
} from '../src/official-documents/entities/official-document.entity';
import {
  SpecialHabilitation,
  SpecialHabilitationSchema,
} from '../src/special-habilitations/entities/special-habilitation.entity';
import {
  VehicleDocument,
  VehicleDocumentSchema,
} from '../src/vehicle-documents/entities/vehicle-document.entity';
import {
  CHANTIERS_BY_MARKET,
  MARKETS,
  SAMPLE_IMAGE,
  STATUSES,
  SeededDerivation,
  buildCompletedDerivationData,
  getSeedChantierEnedisNumbers,
} from '../src/seed/seed-data';

config({ path: resolve(__dirname, '..', '.env') });

const prisma = new PrismaClient();

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomStatus() {
  return STATUSES[Math.floor(Math.random() * STATUSES.length)];
}

function mongoModel<T>(
  name: string,
  schema: mongoose.Schema
): mongoose.Model<T> {
  return (mongoose.models[name] ??
    mongoose.model<T>(name, schema)) as mongoose.Model<T>;
}

function getMongoModels() {
  return {
    HabilitationModel: mongoModel(Habilitation.name, HabilitationSchema),
    SpecialHabilitationModel: mongoModel(
      SpecialHabilitation.name,
      SpecialHabilitationSchema
    ),
    OfficialDocumentModel: mongoModel(
      OfficialDocument.name,
      OfficialDocumentSchema
    ),
    VehicleDocumentModel: mongoModel(
      VehicleDocument.name,
      VehicleDocumentSchema
    ),
    CompletedDerivationModel: mongoModel(
      CompletedDerivation.name,
      CompletedDerivationSchema
    ),
  };
}

async function seedMongoData(userId: number, derivations: SeededDerivation[]) {
  if (!process.env.DATABASE_MONGO_URL) {
    throw new Error('DATABASE_MONGO_URL is required to seed MongoDB.');
  }

  await mongoose.connect(process.env.DATABASE_MONGO_URL);

  const {
    HabilitationModel,
    SpecialHabilitationModel,
    OfficialDocumentModel,
    VehicleDocumentModel,
    CompletedDerivationModel,
  } = getMongoModels();

  await Promise.all([
    HabilitationModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          b0: true,
          bs: true,
          be: false,
          h0: false,
          h0v: false,
          b1: true,
          b1v: true,
          h1: false,
          h1v: false,
          b2: false,
          b2v: false,
          b2vEssais: false,
          h2: false,
          h2v: false,
          h2vEssais: false,
          bc: false,
          hc: false,
          br: true,
          beAttribut: false,
          heAttribut: false,
        },
      },
      { upsert: true, new: true }
    ),
    SpecialHabilitationModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          electricalTitle: true,
          electricalTitleDoc: SAMPLE_IMAGE,
          ss4Title: false,
          ss4TitleDoc: null,
          leadTitle: false,
          leadTitleDoc: null,
          sstCertificate: true,
          sstCertificateDoc: SAMPLE_IMAGE,
        },
      },
      { upsert: true, new: true }
    ),
    OfficialDocumentModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          idCard: SAMPLE_IMAGE,
          btpCard: SAMPLE_IMAGE,
          mutualCard: SAMPLE_IMAGE,
        },
      },
      { upsert: true, new: true }
    ),
    VehicleDocumentModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          vehicleRegistration: SAMPLE_IMAGE,
          drivingLicense: SAMPLE_IMAGE,
        },
      },
      { upsert: true, new: true }
    ),
  ]);

  for (const derivation of derivations) {
    await CompletedDerivationModel.findOneAndUpdate(
      { requestedDerivationId: derivation.id },
      {
        $set: buildCompletedDerivationData(derivation.id, derivation.address),
      },
      { upsert: true, new: true }
    );

    await prisma.derivation.update({
      where: { id: derivation.id },
      data: { status: derivation.status },
    });
  }

  console.log(`   Mongo: documents utilisateur pour userId ${userId}`);
  console.log(`   Mongo: ${derivations.length} derivation(s) completee(s)`);
}

async function undoSeed() {
  const technicianUser = await prisma.user.findFirst({
    where: { role: 'technician' },
    select: { id: true },
  });
  const userId = technicianUser?.id;
  const seedChantierEnedisNumbers = getSeedChantierEnedisNumbers();

  const seedChantiers = await prisma.chantier.findMany({
    where: {
      enedisAffaireNumber: { in: seedChantierEnedisNumbers },
    },
    select: { id: true },
  });
  const seedChantierIds = seedChantiers.map((chantier) => chantier.id);

  const seedDerivations = await prisma.derivation.findMany({
    where: {
      chantierId: { in: seedChantierIds },
    },
    select: { id: true },
  });
  const seedDerivationIds = seedDerivations.map((derivation) => derivation.id);

  let deletedCompletedDerivations = 0;
  let deletedUserMongoDocuments = 0;

  if (process.env.DATABASE_MONGO_URL) {
    await mongoose.connect(process.env.DATABASE_MONGO_URL);
    const {
      HabilitationModel,
      SpecialHabilitationModel,
      OfficialDocumentModel,
      VehicleDocumentModel,
      CompletedDerivationModel,
    } = getMongoModels();

    const completedDeleteResult = await CompletedDerivationModel.deleteMany({
      requestedDerivationId: { $in: seedDerivationIds },
      'clientInfo.name': 'Client Seed',
      'generalInfo.derivationBy': 'Technicien Seed',
    });
    deletedCompletedDerivations = completedDeleteResult.deletedCount ?? 0;

    if (userId) {
      const userDocumentDeleteResults = await Promise.all([
        HabilitationModel.deleteMany({
          userId,
          b0: true,
          bs: true,
          br: true,
        }),
        SpecialHabilitationModel.deleteMany({
          userId,
          electricalTitle: true,
          electricalTitleDoc: SAMPLE_IMAGE,
          sstCertificate: true,
          sstCertificateDoc: SAMPLE_IMAGE,
        }),
        OfficialDocumentModel.deleteMany({
          userId,
          idCard: SAMPLE_IMAGE,
          btpCard: SAMPLE_IMAGE,
          mutualCard: SAMPLE_IMAGE,
        }),
        VehicleDocumentModel.deleteMany({
          userId,
          vehicleRegistration: SAMPLE_IMAGE,
          drivingLicense: SAMPLE_IMAGE,
        }),
      ]);

      deletedUserMongoDocuments = userDocumentDeleteResults.reduce(
        (total, result) => total + (result.deletedCount ?? 0),
        0
      );
    }
  }

  const deletedDerivations = await prisma.derivation.deleteMany({
    where: {
      id: { in: seedDerivationIds },
    },
  });
  const deletedChantiers = await prisma.chantier.deleteMany({
    where: {
      id: { in: seedChantierIds },
    },
  });
  const deletedMarkets = await prisma.market.deleteMany({
    where: {
      name: { in: MARKETS.map((market) => market.name) },
      chantiers: { none: {} },
    },
  });

  console.log('\n✅ Seed undo terminé:');
  console.log(`   Postgres: ${deletedDerivations.count} dérivation(s)`);
  console.log(`   Postgres: ${deletedChantiers.count} chantier(s)`);
  console.log(`   Postgres: ${deletedMarkets.count} marché(s)`);
  console.log(
    `   Mongo: ${deletedCompletedDerivations} dérivation(s) complétée(s)`
  );
  console.log(`   Mongo: ${deletedUserMongoDocuments} document(s) utilisateur`);
}

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
  const seededChantierIds: number[] = [];

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

      seededChantierIds.push(chantier.id);
      const existingDerivations = await prisma.derivation.count({
        where: {
          userId,
          chantierId: chantier.id,
        },
      });
      const count = existingDerivations > 0 ? 0 : randomBetween(1, 10);

      console.log(
        `  🏗  Chantier: ${chantier.address} → ${count} nouvelle(s) dérivation(s)`
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

        totalDerivations++;
      }

      totalChantiers++;
    }
  }

  console.log(`\n✅ Seeded:`);
  console.log(`   ${MARKETS.length} marchés`);
  console.log(`   ${totalChantiers} chantiers`);
  console.log(`   ${totalDerivations} dérivations`);

  const derivationsToBackfill = await prisma.derivation.findMany({
    where: {
      userId,
      chantierId: { in: seededChantierIds },
    },
    select: {
      id: true,
      status: true,
      chantier: {
        select: {
          address: true,
        },
      },
    },
  });

  await seedMongoData(
    userId,
    derivationsToBackfill.map((derivation) => ({
      id: derivation.id,
      status: derivation.status as (typeof STATUSES)[number],
      address: derivation.chantier?.address ?? 'Adresse inconnue',
    }))
  );
}

const command = process.argv.includes('--undo') ? undoSeed : main;

command()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await mongoose.disconnect();
  });
