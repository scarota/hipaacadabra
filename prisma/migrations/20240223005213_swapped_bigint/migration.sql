/*
  Warnings:

  - You are about to alter the column `amount` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `revenue` on the `revenue` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.

*/
-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "amount" SET DATA TYPE INT4;

-- AlterTable
ALTER TABLE "revenue" ALTER COLUMN "revenue" SET DATA TYPE INT4;
