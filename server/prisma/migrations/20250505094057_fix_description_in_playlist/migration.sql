/*
  Warnings:

  - You are about to drop the column `desription` on the `Playlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "desription",
ADD COLUMN     "description" TEXT;
