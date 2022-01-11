/*
  Warnings:

  - You are about to drop the `Element` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ElementToReportError` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ElementToReportError" DROP CONSTRAINT "_ElementToReportError_A_fkey";

-- DropForeignKey
ALTER TABLE "_ElementToReportError" DROP CONSTRAINT "_ElementToReportError_B_fkey";

-- DropTable
DROP TABLE "Element";

-- DropTable
DROP TABLE "_ElementToReportError";
