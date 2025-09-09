-- AlterTable
ALTER TABLE "public"."staff" ADD COLUMN     "positionId" INTEGER;

-- CreateTable
CREATE TABLE "public"."staff_positions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "staff_positions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."staff" ADD CONSTRAINT "staff_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "public"."staff_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
