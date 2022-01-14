/*
  Warnings:

  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReportError` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ReportToReportError` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "JobErrorSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_pageId_fkey";

-- DropForeignKey
ALTER TABLE "_ReportToReportError" DROP CONSTRAINT "_ReportToReportError_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReportToReportError" DROP CONSTRAINT "_ReportToReportError_B_fkey";

-- DropTable
DROP TABLE "Report";

-- DropTable
DROP TABLE "ReportError";

-- DropTable
DROP TABLE "_ReportToReportError";

-- DropEnum
DROP TYPE "ReportErrorSeverity";

-- CreateTable
CREATE TABLE "JobError" (
    "id" SERIAL NOT NULL,
    "expected" VARCHAR(512) NOT NULL,
    "result" VARCHAR(512) NOT NULL,
    "severity" "JobErrorSeverity" NOT NULL,
    "operation" VARCHAR(512) NOT NULL,
    "elementIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "JobError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "startedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(6) NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "elementsFound" INTEGER NOT NULL,
    "nextPageAvailable" BOOLEAN NOT NULL,
    "parsedElementItemsSuc" INTEGER NOT NULL,
    "parsedElementItemsFail" INTEGER NOT NULL,
    "pageId" INTEGER NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobToJobError" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "JobError_expected_result_severity_operation_elementIndex_key" ON "JobError"("expected", "result", "severity", "operation", "elementIndex");

-- CreateIndex
CREATE UNIQUE INDEX "_JobToJobError_AB_unique" ON "_JobToJobError"("A", "B");

-- CreateIndex
CREATE INDEX "_JobToJobError_B_index" ON "_JobToJobError"("B");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToJobError" ADD FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToJobError" ADD FOREIGN KEY ("B") REFERENCES "JobError"("id") ON DELETE CASCADE ON UPDATE CASCADE;
