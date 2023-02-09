/*
  Warnings:

  - You are about to drop the `_DeveloperToProjectChatChannel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DeveloperToProjectChatChannel" DROP CONSTRAINT "_DeveloperToProjectChatChannel_A_fkey";

-- DropForeignKey
ALTER TABLE "_DeveloperToProjectChatChannel" DROP CONSTRAINT "_DeveloperToProjectChatChannel_B_fkey";

-- DropTable
DROP TABLE "_DeveloperToProjectChatChannel";

-- CreateTable
CREATE TABLE "_channelParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_channelAdmins" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_channelParticipants_AB_unique" ON "_channelParticipants"("A", "B");

-- CreateIndex
CREATE INDEX "_channelParticipants_B_index" ON "_channelParticipants"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_channelAdmins_AB_unique" ON "_channelAdmins"("A", "B");

-- CreateIndex
CREATE INDEX "_channelAdmins_B_index" ON "_channelAdmins"("B");

-- AddForeignKey
ALTER TABLE "_channelParticipants" ADD CONSTRAINT "_channelParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelParticipants" ADD CONSTRAINT "_channelParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectChatChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelAdmins" ADD CONSTRAINT "_channelAdmins_A_fkey" FOREIGN KEY ("A") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelAdmins" ADD CONSTRAINT "_channelAdmins_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectChatChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
