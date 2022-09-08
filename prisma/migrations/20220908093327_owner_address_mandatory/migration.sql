/*
  Warnings:

  - Made the column `ownerWalletAddress` on table `Nft` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Nft" DROP CONSTRAINT "Nft_ownerWalletAddress_fkey";

-- AlterTable
ALTER TABLE "Nft" ALTER COLUMN "ownerWalletAddress" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_ownerWalletAddress_fkey" FOREIGN KEY ("ownerWalletAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
