/*
  Warnings:

  - Made the column `isStaked` on table `Nft` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Nft" ALTER COLUMN "isStaked" SET NOT NULL;
