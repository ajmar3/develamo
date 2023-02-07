/*
  Warnings:

  - You are about to drop the column `chatId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `chatId` on the `ProjectChatMessage` table. All the data in the column will be lost.
  - You are about to drop the `_DeveloperToProjectChat` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `developerId` to the `ProjectChat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `ProjectChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectChat" DROP CONSTRAINT "ProjectChat_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectChatMessage" DROP CONSTRAINT "ProjectChatMessage_chatId_fkey";

-- DropForeignKey
ALTER TABLE "_DeveloperToProjectChat" DROP CONSTRAINT "_DeveloperToProjectChat_A_fkey";

-- DropForeignKey
ALTER TABLE "_DeveloperToProjectChat" DROP CONSTRAINT "_DeveloperToProjectChat_B_fkey";

-- DropIndex
DROP INDEX "Project_chatId_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "chatId";

-- AlterTable
ALTER TABLE "ProjectChat" ADD COLUMN     "developerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProjectChatMessage" DROP COLUMN "chatId",
ADD COLUMN     "channelId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_DeveloperToProjectChat";

-- CreateTable
CREATE TABLE "ProjectChatChannel" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "ProjectChatChannel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectChatChannel" ADD CONSTRAINT "ProjectChatChannel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectChatChannel" ADD CONSTRAINT "ProjectChatChannel_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ProjectChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectChat" ADD CONSTRAINT "ProjectChat_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectChat" ADD CONSTRAINT "ProjectChat_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectChatMessage" ADD CONSTRAINT "ProjectChatMessage_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "ProjectChatChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
