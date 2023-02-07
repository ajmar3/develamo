/*
  Warnings:

  - You are about to drop the column `developerId` on the `ProjectChat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectChat" DROP CONSTRAINT "ProjectChat_developerId_fkey";

-- AlterTable
ALTER TABLE "ProjectChat" DROP COLUMN "developerId";

-- CreateTable
CREATE TABLE "_DeveloperToProjectChatChannel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DeveloperToProjectChatChannel_AB_unique" ON "_DeveloperToProjectChatChannel"("A", "B");

-- CreateIndex
CREATE INDEX "_DeveloperToProjectChatChannel_B_index" ON "_DeveloperToProjectChatChannel"("B");

-- AddForeignKey
ALTER TABLE "_DeveloperToProjectChatChannel" ADD CONSTRAINT "_DeveloperToProjectChatChannel_A_fkey" FOREIGN KEY ("A") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeveloperToProjectChatChannel" ADD CONSTRAINT "_DeveloperToProjectChatChannel_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectChatChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
