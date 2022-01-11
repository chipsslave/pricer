/*
  Warnings:

  - You are about to drop the column `elementId` on the `ReportError` table. All the data in the column will be lost.
  - You are about to drop the column `reportId` on the `ReportError` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[expected,result,severity,operation,elementIndex]` on the table `ReportError` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ReportError" DROP CONSTRAINT "ReportError_elementId_fkey";

-- DropForeignKey
ALTER TABLE "ReportError" DROP CONSTRAINT "ReportError_reportId_fkey";

-- AlterTable
ALTER TABLE "ReportError" DROP COLUMN "elementId",
DROP COLUMN "reportId";

-- CreateTable
CREATE TABLE "_ReportToReportError" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ElementToReportError" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ReportToReportError_AB_unique" ON "_ReportToReportError"("A", "B");

-- CreateIndex
CREATE INDEX "_ReportToReportError_B_index" ON "_ReportToReportError"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ElementToReportError_AB_unique" ON "_ElementToReportError"("A", "B");

-- CreateIndex
CREATE INDEX "_ElementToReportError_B_index" ON "_ElementToReportError"("B");

-- CreateIndex
CREATE UNIQUE INDEX "ReportError_expected_result_severity_operation_elementIndex_key" ON "ReportError"("expected", "result", "severity", "operation", "elementIndex");

-- AddForeignKey
ALTER TABLE "_ReportToReportError" ADD FOREIGN KEY ("A") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportToReportError" ADD FOREIGN KEY ("B") REFERENCES "ReportError"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ElementToReportError" ADD FOREIGN KEY ("A") REFERENCES "Element"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ElementToReportError" ADD FOREIGN KEY ("B") REFERENCES "ReportError"("id") ON DELETE CASCADE ON UPDATE CASCADE;
