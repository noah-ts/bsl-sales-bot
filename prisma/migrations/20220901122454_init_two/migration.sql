-- AlterTable
ALTER TABLE "Nft" ALTER COLUMN "lastSaleTimeStamp" DROP NOT NULL,
ALTER COLUMN "lastSaleAmount" DROP NOT NULL,
ALTER COLUMN "lastSaleAmount" SET DATA TYPE BIGINT;
