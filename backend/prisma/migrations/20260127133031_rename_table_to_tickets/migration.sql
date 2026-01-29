/*
  Warnings:

  - You are about to drop the `Ticket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_authorId_fkey";

-- DropTable
DROP TABLE "Ticket";

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "channel" "Channel" NOT NULL DEFAULT 'WEB_MOBILE',
    "status" "TicketStatus" NOT NULL DEFAULT 'NOUVEAU',
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "cityOrTerritory" TEXT NOT NULL,
    "healthZone" TEXT,
    "structureName" TEXT,
    "description" TEXT,
    "audioUrl" TEXT,
    "photoUrl" TEXT,
    "timeSince" "TimeSince",
    "impactLevel" "ImpactLevel",
    "gravity" "Gravity" NOT NULL DEFAULT 'NORMAL',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "contactPhone" TEXT,
    "contactPref" "ContactPreference",
    "metadata" JSONB,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tickets_shortId_key" ON "tickets"("shortId");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
