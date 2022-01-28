/*
  Warnings:

  - A unique constraint covering the columns `[title,brandId]` on the table `Model` will be added. If there are existing duplicate values, this will fail.
  - Made the column `brandId` on table `Model` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_brandId_fkey";

-- AlterTable
ALTER TABLE "Model" ALTER COLUMN "brandId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Model_title_brandId_key" ON "Model"("title", "brandId");

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
