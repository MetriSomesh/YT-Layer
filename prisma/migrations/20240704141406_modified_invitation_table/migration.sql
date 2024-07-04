/*
  Warnings:

  - A unique constraint covering the columns `[channelId]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "videoCount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "channelId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_channelId_key" ON "Invitation"("channelId");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
