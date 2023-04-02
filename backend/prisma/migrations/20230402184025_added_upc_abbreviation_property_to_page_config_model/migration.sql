/*
  Warnings:

  - Added the required column `upcAbbreviation` to the `PageConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PageConfig" ADD COLUMN     "upcAbbreviation" TEXT NOT NULL;
