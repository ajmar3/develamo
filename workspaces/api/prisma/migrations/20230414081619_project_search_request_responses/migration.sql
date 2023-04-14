-- AlterTable
ALTER TABLE "ProjectSearchRequest" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "resolvedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ProjectSearchRequestAnswer" (
    "id" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectSearchRequestAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectSearchRequestAnswer_requestId_key" ON "ProjectSearchRequestAnswer"("requestId");

-- AddForeignKey
ALTER TABLE "ProjectSearchRequestAnswer" ADD CONSTRAINT "ProjectSearchRequestAnswer_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSearchRequestAnswer" ADD CONSTRAINT "ProjectSearchRequestAnswer_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ProjectSearchRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSearchRequestAnswer" ADD CONSTRAINT "ProjectSearchRequestAnswer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
