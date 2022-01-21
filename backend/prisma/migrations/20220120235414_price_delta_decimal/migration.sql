/*
  Warnings:

  - You are about to alter the column `delta` on the `Price` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(6,2)`.

*/
-- AlterTable
ALTER TABLE "Price" ALTER COLUMN "delta" SET DATA TYPE DECIMAL(6,2);
