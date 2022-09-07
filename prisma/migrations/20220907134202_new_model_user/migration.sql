-- AlterTable
ALTER TABLE "Nft" ADD COLUMN     "ownerWalletAddress" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "walletAddress" TEXT NOT NULL,
    "twitter" TEXT,
    "discord" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("walletAddress")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_ownerWalletAddress_fkey" FOREIGN KEY ("ownerWalletAddress") REFERENCES "User"("walletAddress") ON DELETE SET NULL ON UPDATE CASCADE;
