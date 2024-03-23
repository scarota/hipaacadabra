/*
  Warnings:

  - The `status` column on the `invoices` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'paid');

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "status";
ALTER TABLE "invoices" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'pending';
