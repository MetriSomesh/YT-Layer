-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('YOUTUBER', 'EDITOR');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YouTuber" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "api_key" TEXT NOT NULL,

    CONSTRAINT "YouTuber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "youtuberId" INTEGER NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Editor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,

    CONSTRAINT "Editor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "YouTuber_userId_key" ON "YouTuber"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "YouTuber_api_key_key" ON "YouTuber"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "Editor_userId_key" ON "Editor"("userId");

-- AddForeignKey
ALTER TABLE "YouTuber" ADD CONSTRAINT "YouTuber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_youtuberId_fkey" FOREIGN KEY ("youtuberId") REFERENCES "YouTuber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Editor" ADD CONSTRAINT "Editor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
