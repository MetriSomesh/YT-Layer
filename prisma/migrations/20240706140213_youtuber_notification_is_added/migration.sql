-- CreateTable
CREATE TABLE "YouTuberNotification" (
    "id" SERIAL NOT NULL,
    "youtuberId" INTEGER,
    "editorId" INTEGER,
    "status" TEXT,

    CONSTRAINT "YouTuberNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YouTuberNotification_youtuberId_key" ON "YouTuberNotification"("youtuberId");

-- CreateIndex
CREATE UNIQUE INDEX "YouTuberNotification_editorId_key" ON "YouTuberNotification"("editorId");

-- AddForeignKey
ALTER TABLE "YouTuberNotification" ADD CONSTRAINT "YouTuberNotification_youtuberId_fkey" FOREIGN KEY ("youtuberId") REFERENCES "YouTuber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YouTuberNotification" ADD CONSTRAINT "YouTuberNotification_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "Editor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
