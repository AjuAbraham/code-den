/*
  Warnings:

  - Added the required column `content` to the `Solutions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Solutions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Solutions" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "title" TEXT NOT NULL;
