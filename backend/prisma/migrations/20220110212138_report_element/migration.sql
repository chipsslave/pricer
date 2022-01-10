/*
  Warnings:

  - You are about to drop the column `element` on the `ReportError` table. All the data in the column will be lost.
  - You are about to drop the column `elementHash` on the `ReportError` table. All the data in the column will be lost.
  - Added the required column `elementId` to the `ReportError` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ReportError_elementHash_key";

-- DropIndex
DROP INDEX "ReportError_element_key";

-- AlterTable
ALTER TABLE "ReportError" DROP COLUMN "element",
DROP COLUMN "elementHash",
ADD COLUMN     "elementId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Element" (
    "id" SERIAL NOT NULL,
    "element" TEXT NOT NULL,
    "elementHash" VARCHAR(512) NOT NULL,

    CONSTRAINT "Element_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Element_element_key" ON "Element"("element");

-- CreateIndex
CREATE UNIQUE INDEX "Element_elementHash_key" ON "Element"("elementHash");

-- AddForeignKey
ALTER TABLE "ReportError" ADD CONSTRAINT "ReportError_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
