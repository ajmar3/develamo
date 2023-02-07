/*
  Warnings:

  - Added the required column `chatId` to the `Connection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Connection" ADD COLUMN     "chatId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "DirectMessageChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
