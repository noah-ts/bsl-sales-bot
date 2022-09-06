-- CreateTable
CREATE TABLE "Nft" (
    "mint" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "lastSaleTimeStamp" INTEGER NOT NULL,
    "lastSaleAmount" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Nft_mint_key" ON "Nft"("mint");
