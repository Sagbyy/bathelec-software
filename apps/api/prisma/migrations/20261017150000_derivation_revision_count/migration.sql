ALTER TABLE "Derivation" ADD COLUMN "revisionCount" INTEGER NOT NULL DEFAULT 0;

UPDATE "Derivation" SET "revisionCount" = 1 WHERE "status" = 'Revising';
