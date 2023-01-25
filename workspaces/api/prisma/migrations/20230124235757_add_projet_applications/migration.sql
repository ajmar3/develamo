-- CreateTable
CREATE TABLE "ProjectApplication" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "successful" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectApplication" ADD CONSTRAINT "ProjectApplication_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
