/*
  Warnings:

  - You are about to drop the column `channel` on the `Editor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profile_pic]` on the table `Editor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city` to the `Editor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Editor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Editor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `Editor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Editor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_pic` to the `Editor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Editor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Editor" DROP COLUMN "channel",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "experience" INTEGER NOT NULL,
ADD COLUMN     "phone_number" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "profile_pic" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Editor_profile_pic_key" ON "Editor"("profile_pic");
