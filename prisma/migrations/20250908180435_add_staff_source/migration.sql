-- AlterTable
ALTER TABLE "public"."staff" ADD COLUMN     "sourceId" INTEGER;

-- CreateTable
CREATE TABLE "public"."staff_sources" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "staff_sources_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."staff" ADD CONSTRAINT "staff_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "public"."staff_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
