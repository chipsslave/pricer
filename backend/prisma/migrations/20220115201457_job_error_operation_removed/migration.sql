/*
  Warnings:

  - You are about to drop the column `operation` on the `JobError` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[expected,result,severity,elementIndex]` on the table `JobError` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "JobError_expected_result_severity_operation_elementIndex_key";

-- AlterTable
ALTER TABLE "JobError" DROP COLUMN "operation";

-- CreateIndex
CREATE UNIQUE INDEX "JobError_expected_result_severity_elementIndex_key" ON "JobError"("expected", "result", "severity", "elementIndex");
