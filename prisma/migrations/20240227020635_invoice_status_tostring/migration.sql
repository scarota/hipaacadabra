/*
  Warnings:

  - Made the column `status` on table `invoices` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "status" SET NOT NULL;
