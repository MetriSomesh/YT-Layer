/*
  Warnings:

  - A unique constraint covering the columns `[youtuberId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Video_youtuberId_key" ON "Video"("youtuberId");
