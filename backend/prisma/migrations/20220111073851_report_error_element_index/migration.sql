/*
  Warnings:

  - Made the column `elementIndex` on table `ReportError` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ReportError" ALTER COLUMN "elementIndex" SET NOT NULL,
ALTER COLUMN "elementIndex" SET DEFAULT 0;
