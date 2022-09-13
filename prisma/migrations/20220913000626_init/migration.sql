-- CreateEnum
CREATE TYPE "Status" AS ENUM ('LISTED', 'STAKED', 'HELD_BY_OWNER');

-- CreateTable
CREATE TABLE "Nft" (
    "mint" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "lastSaleDate" TEXT,
    "lastSaleAmountSol" DOUBLE PRECISION,
    "ownerWalletAddress" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Nft_pkey" PRIMARY KEY ("mint")
);

-- CreateTable
CREATE TABLE "User" (
    "walletAddress" TEXT NOT NULL,
    "twitter" TEXT,
    "discord" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("walletAddress")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nft_mint_key" ON "Nft"("mint");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_ownerWalletAddress_fkey" FOREIGN KEY ("ownerWalletAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
