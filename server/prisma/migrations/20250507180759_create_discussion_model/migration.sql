/*
  Warnings:

  - You are about to drop the column `parentId` on the `Solutions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Solutions" DROP CONSTRAINT "Solutions_parentId_fkey";

-- AlterTable
ALTER TABLE "Solutions" DROP COLUMN "parentId";

-- CreateTable
CREATE TABLE "SolutionDiscussion" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "SolutionDiscussion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SolutionDiscussion" ADD CONSTRAINT "SolutionDiscussion_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SolutionDiscussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionDiscussion" ADD CONSTRAINT "SolutionDiscussion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionDiscussion" ADD CONSTRAINT "SolutionDiscussion_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
