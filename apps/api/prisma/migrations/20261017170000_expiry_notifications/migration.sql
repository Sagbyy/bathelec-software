CREATE TABLE "ExpiryNotification" (
    "id" SERIAL NOT NULL,
    "technicianId" INTEGER NOT NULL,
    "documentKey" TEXT NOT NULL,
    "documentLabel" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "threshold" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpiryNotification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExpiryNotificationReceipt" (
    "notificationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "acknowledgedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpiryNotificationReceipt_pkey" PRIMARY KEY ("notificationId","userId")
);

CREATE INDEX "ExpiryNotification_technicianId_idx" ON "ExpiryNotification"("technicianId");

CREATE UNIQUE INDEX "ExpiryNotification_document_threshold_key" ON "ExpiryNotification"("technicianId", "documentKey", "expiresAt", "threshold");

ALTER TABLE "ExpiryNotification" ADD CONSTRAINT "ExpiryNotification_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExpiryNotificationReceipt" ADD CONSTRAINT "ExpiryNotificationReceipt_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "ExpiryNotification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExpiryNotificationReceipt" ADD CONSTRAINT "ExpiryNotificationReceipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
