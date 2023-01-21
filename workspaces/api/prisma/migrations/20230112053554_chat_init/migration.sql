/*
  Warnings:

  - A unique constraint covering the columns `[chatId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "chatId" TEXT;

-- CreateTable
CREATE TABLE "DirectMessageChat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DirectMessageChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectMessage" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL,

    CONSTRAINT "DirectMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectChat" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectChatMessage" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "ProjectChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DeveloperToDirectMessageChat" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DeveloperToProjectChat" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_seenProjectMessages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectChat_projectId_key" ON "ProjectChat"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "_DeveloperToDirectMessageChat_AB_unique" ON "_DeveloperToDirectMessageChat"("A", "B");

-- CreateIndex
CREATE INDEX "_DeveloperToDirectMessageChat_B_index" ON "_DeveloperToDirectMessageChat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DeveloperToProjectChat_AB_unique" ON "_DeveloperToProjectChat"("A", "B");

-- CreateIndex
CREATE INDEX "_DeveloperToProjectChat_B_index" ON "_DeveloperToProjectChat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_seenProjectMessages_AB_unique" ON "_seenProjectMessages"("A", "B");

-- CreateIndex
CREATE INDEX "_seenProjectMessages_B_index" ON "_seenProjectMessages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Project_chatId_key" ON "Project"("chatId");

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "DirectMessageChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectChat" ADD CONSTRAINT "ProjectChat_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectChatMessage" ADD CONSTRAINT "ProjectChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectChatMessage" ADD CONSTRAINT "ProjectChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ProjectChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeveloperToDirectMessageChat" ADD CONSTRAINT "_DeveloperToDirectMessageChat_A_fkey" FOREIGN KEY ("A") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeveloperToDirectMessageChat" ADD CONSTRAINT "_DeveloperToDirectMessageChat_B_fkey" FOREIGN KEY ("B") REFERENCES "DirectMessageChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeveloperToProjectChat" ADD CONSTRAINT "_DeveloperToProjectChat_A_fkey" FOREIGN KEY ("A") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeveloperToProjectChat" ADD CONSTRAINT "_DeveloperToProjectChat_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_seenProjectMessages" ADD CONSTRAINT "_seenProjectMessages_A_fkey" FOREIGN KEY ("A") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_seenProjectMessages" ADD CONSTRAINT "_seenProjectMessages_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
