/*
  Warnings:

  - A unique constraint covering the columns `[youtuberId]` on the table `Editor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Editor" ADD COLUMN     "youtuberId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Editor_youtuberId_key" ON "Editor"("youtuberId");

-- AddForeignKey
ALTER TABLE "Editor" ADD CONSTRAINT "Editor_youtuberId_fkey" FOREIGN KEY ("youtuberId") REFERENCES "YouTuber"("id") ON DELETE SET NULL ON UPDATE CASCADE;
