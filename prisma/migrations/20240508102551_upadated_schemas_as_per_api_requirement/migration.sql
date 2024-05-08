/*
  Warnings:

  - You are about to drop the column `api_key` on the `YouTuber` table. All the data in the column will be lost.
  - Added the required column `description` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "YouTuber" DROP COLUMN "api_key",
ADD COLUMN     "accessToken" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "refreshToken" TEXT NOT NULL DEFAULT '';
