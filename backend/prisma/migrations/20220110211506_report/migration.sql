-- CreateEnum
CREATE TYPE "ReportErrorSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "ReportError" (
    "id" SERIAL NOT NULL,
    "expected" VARCHAR(512) NOT NULL,
    "result" VARCHAR(512) NOT NULL,
    "severity" "ReportErrorSeverity" NOT NULL,
    "operation" VARCHAR(512) NOT NULL,
    "element" TEXT,
    "elementHash" VARCHAR(512),
    "elementIndex" INTEGER,
    "reportId" INTEGER NOT NULL,

    CONSTRAINT "ReportError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
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

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReportError_element_key" ON "ReportError"("element");

-- CreateIndex
CREATE UNIQUE INDEX "ReportError_elementHash_key" ON "ReportError"("elementHash");

-- AddForeignKey
ALTER TABLE "ReportError" ADD CONSTRAINT "ReportError_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
