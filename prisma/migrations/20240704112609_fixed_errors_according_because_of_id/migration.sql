/*
  Warnings:

  - The primary key for the `Channel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Channel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `youtuberId` column on the `Channel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Editor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Editor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `userId` column on the `Editor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `youtuberId` column on the `Editor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Invitation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Invitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `youtuberId` column on the `Invitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `editorId` column on the `Invitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Video` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `youtuberId` column on the `Video` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `YouTuber` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `YouTuber` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `userId` column on the `YouTuber` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_youtuberId_fkey";

-- DropForeignKey
ALTER TABLE "Editor" DROP CONSTRAINT "Editor_userId_fkey";

-- DropForeignKey
ALTER TABLE "Editor" DROP CONSTRAINT "Editor_youtuberId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_editorId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_youtuberId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_youtuberId_fkey";

-- DropForeignKey
ALTER TABLE "YouTuber" DROP CONSTRAINT "YouTuber_userId_fkey";

-- DropIndex
DROP INDEX "User_id_key";

-- DropIndex
DROP INDEX "YouTuber_id_key";

-- AlterTable
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "youtuberId",
ADD COLUMN     "youtuberId" INTEGER,
ADD CONSTRAINT "Channel_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Editor" DROP CONSTRAINT "Editor_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER,
DROP COLUMN "youtuberId",
ADD COLUMN     "youtuberId" INTEGER,
ADD CONSTRAINT "Editor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "youtuberId",
ADD COLUMN     "youtuberId" INTEGER,
DROP COLUMN "editorId",
ADD COLUMN     "editorId" INTEGER,
ADD CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Video" DROP CONSTRAINT "Video_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "youtuberId",
ADD COLUMN     "youtuberId" INTEGER,
ADD CONSTRAINT "Video_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "YouTuber" DROP CONSTRAINT "YouTuber_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER,
ADD CONSTRAINT "YouTuber_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_youtuberId_key" ON "Channel"("youtuberId");

-- CreateIndex
CREATE UNIQUE INDEX "Editor_userId_key" ON "Editor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Editor_youtuberId_key" ON "Editor"("youtuberId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_youtuberId_key" ON "Invitation"("youtuberId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_editorId_key" ON "Invitation"("editorId");

-- CreateIndex
CREATE UNIQUE INDEX "Video_youtuberId_key" ON "Video"("youtuberId");

-- CreateIndex
CREATE UNIQUE INDEX "YouTuber_userId_key" ON "YouTuber"("userId");

-- AddForeignKey
ALTER TABLE "YouTuber" ADD CONSTRAINT "YouTuber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_youtuberId_fkey" FOREIGN KEY ("youtuberId") REFERENCES "YouTuber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_youtuberId_fkey" FOREIGN KEY ("youtuberId") REFERENCES "YouTuber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Editor" ADD CONSTRAINT "Editor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Editor" ADD CONSTRAINT "Editor_youtuberId_fkey" FOREIGN KEY ("youtuberId") REFERENCES "YouTuber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_youtuberId_fkey" FOREIGN KEY ("youtuberId") REFERENCES "YouTuber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "Editor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
