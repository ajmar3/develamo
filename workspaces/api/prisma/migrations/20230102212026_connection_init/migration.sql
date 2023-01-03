-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "connectListId" TEXT NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectionRequest" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "requestedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "successful" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ConnectionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectionList" (
    "id" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,

    CONSTRAINT "ConnectionList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Connection_developerId_key" ON "Connection"("developerId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_connectListId_key" ON "Connection"("connectListId");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectionRequest_requesterId_key" ON "ConnectionRequest"("requesterId");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectionRequest_requestedId_key" ON "ConnectionRequest"("requestedId");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectionList_developerId_key" ON "ConnectionList"("developerId");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_connectListId_fkey" FOREIGN KEY ("connectListId") REFERENCES "ConnectionList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionRequest" ADD CONSTRAINT "ConnectionRequest_requestedId_fkey" FOREIGN KEY ("requestedId") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionList" ADD CONSTRAINT "ConnectionList_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
