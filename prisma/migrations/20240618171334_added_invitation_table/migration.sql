-- CreateTable
CREATE TABLE "Invitation" (
    "id" SERIAL NOT NULL,
    "youtuberId" INTEGER NOT NULL,
    "editorId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_youtuberId_key" ON "Invitation"("youtuberId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_editorId_key" ON "Invitation"("editorId");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_youtuberId_fkey" FOREIGN KEY ("youtuberId") REFERENCES "YouTuber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "Editor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
