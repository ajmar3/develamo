-- CreateTable
CREATE TABLE "ProjectSearchRequest" (
    "id" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "allTagsRequired" BOOLEAN NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectSearchRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectSearchRequestToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectSearchRequestToTag_AB_unique" ON "_ProjectSearchRequestToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectSearchRequestToTag_B_index" ON "_ProjectSearchRequestToTag"("B");

-- AddForeignKey
ALTER TABLE "ProjectSearchRequest" ADD CONSTRAINT "ProjectSearchRequest_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectSearchRequestToTag" ADD CONSTRAINT "_ProjectSearchRequestToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectSearchRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectSearchRequestToTag" ADD CONSTRAINT "_ProjectSearchRequestToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
