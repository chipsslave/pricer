/*
  Warnings:

  - You are about to alter the column `price` on the `Price` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(9,2)`.

*/
-- AlterTable
ALTER TABLE "Price" ALTER COLUMN "price" SET DATA TYPE DECIMAL(9,2);
