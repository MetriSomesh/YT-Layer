/*
  Warnings:

  - Made the column `youtuberId` on table `Channel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `YouTuber` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_youtuberId_fkey";

-- DropForeignKey
ALTER TABLE "YouTuber" DROP CONSTRAINT "YouTuber_userId_fkey";

-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "youtuberId" SET NOT NULL;

-- AlterTable
ALTER TABLE "YouTuber" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "YouTuber" ADD CONSTRAINT "YouTuber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_youtuberId_fkey" FOREIGN KEY ("youtuberId") REFERENCES "YouTuber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
