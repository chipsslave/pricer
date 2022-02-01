/*
  Warnings:

  - A unique constraint covering the columns `[expected,result,severity,operation,elementIndex]` on the table `JobError` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `operation` to the `JobError` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "JobError_expected_result_severity_elementIndex_key";

-- AlterTable
ALTER TABLE "JobError" ADD COLUMN     "operation" VARCHAR(256) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "JobError_expected_result_severity_operation_elementIndex_key" ON "JobError"("expected", "result", "severity", "operation", "elementIndex");
