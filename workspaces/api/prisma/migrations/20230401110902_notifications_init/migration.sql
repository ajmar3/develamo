-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "developerId" TEXT NOT NULL,
    "referencedDeveloperId" TEXT,
    "referencedChatId" TEXT,
    "referencedProjectId" TEXT,
    "message" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_referencedDeveloperId_fkey" FOREIGN KEY ("referencedDeveloperId") REFERENCES "Developer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_referencedChatId_fkey" FOREIGN KEY ("referencedChatId") REFERENCES "DirectMessageChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_referencedProjectId_fkey" FOREIGN KEY ("referencedProjectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
