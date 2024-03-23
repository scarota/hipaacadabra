/*
  Warnings:

  - Changed the type of `status` on the `invoices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "status";
ALTER TABLE "invoices" ADD COLUMN "status" STRING(255);

-- DropEnum
DROP TYPE "Status";
