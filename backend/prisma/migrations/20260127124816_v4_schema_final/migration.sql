-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CITOYEN', 'AGENT_ZS', 'AGENT_DPS', 'INSPECTEUR', 'ADMIN_IT');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('NOUVEAU', 'PRIS_EN_CHARGE', 'RESOLU', 'CLOTURE_REJET');

-- CreateEnum
CREATE TYPE "Gravity" AS ENUM ('NORMAL', 'GRAVE', 'TRES_GRAVE');

-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('WHATSAPP', 'WEB_MOBILE', 'APPEL');

-- CreateEnum
CREATE TYPE "ImpactLevel" AS ENUM ('ONE_PERSON', 'SEVERAL', 'MANY');

-- CreateEnum
CREATE TYPE "TimeSince" AS ENUM ('TODAY', 'FEW_DAYS', 'WEEK', 'MORE');

-- CreateEnum
CREATE TYPE "ContactPreference" AS ENUM ('WHATSAPP', 'CALL', 'SMS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CITOYEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
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

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_shortId_key" ON "Ticket"("shortId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
