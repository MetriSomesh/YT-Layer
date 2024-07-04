-- DropForeignKey
ALTER TABLE "Editor" DROP CONSTRAINT "Editor_userId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_editorId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_youtuberId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_youtuberId_fkey";

-- DropForeignKey
ALTER TABLE "YouTuber" DROP CONSTRAINT "YouTuber_userId_fkey";

-- AlterTable
ALTER TABLE "Editor" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "youtuberId" DROP NOT NULL,
ALTER COLUMN "editorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "youtuberId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "YouTuber" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "YouTuber" ADD CONSTRAINT "YouTuber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_youtuberId_fkey" FOREIGN KEY ("youtuberId") REFERENCES "YouTuber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Editor" ADD CONSTRAINT "Editor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_youtuberId_fkey" FOREIGN KEY ("youtuberId") REFERENCES "YouTuber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "Editor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
