/*
  Warnings:

  - You are about to alter the column `url` on the `Page` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(512)`.
  - You are about to alter the column `title` on the `Store` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `homeUrl` on the `Store` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(512)`.
  - Made the column `homeUrl` on table `Store` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "url" SET DATA TYPE VARCHAR(512),
ALTER COLUMN "pageStartsAt" SET DEFAULT 0,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "homeUrl" SET NOT NULL,
ALTER COLUMN "homeUrl" SET DATA TYPE VARCHAR(512),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(6);
