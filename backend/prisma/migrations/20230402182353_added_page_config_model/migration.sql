-- CreateEnum
CREATE TYPE "LoggingLevel" AS ENUM ('INFO', 'DEBUG');

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "pageConfigId" INTEGER;

-- CreateTable
CREATE TABLE "PageConfig" (
    "id" SERIAL NOT NULL,
    "itemsPerPage" INTEGER NOT NULL,
    "pageStartsAt" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "loggingLevel" "LoggingLevel" NOT NULL DEFAULT 'INFO',
    "maxNumberOfAttempts" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "PageConfig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_pageConfigId_fkey" FOREIGN KEY ("pageConfigId") REFERENCES "PageConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
