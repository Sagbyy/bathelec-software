-- CreateTable
CREATE TABLE "DerivationToComplete" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "DerivationToComplete_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DerivationToComplete" ADD CONSTRAINT "DerivationToComplete_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
