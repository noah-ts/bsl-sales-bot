/*
  Warnings:

  - You are about to drop the column `lastSaleAmount` on the `Nft` table. All the data in the column will be lost.
  - You are about to drop the column `lastSaleTimeStamp` on the `Nft` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Nft" DROP COLUMN "lastSaleAmount",
DROP COLUMN "lastSaleTimeStamp";
