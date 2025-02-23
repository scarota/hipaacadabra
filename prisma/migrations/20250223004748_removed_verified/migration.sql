/*
  Warnings:

  - You are about to drop the column `is_verified` on the `portal_api_configs` table. All the data in the column will be lost.
  - You are about to drop the column `last_verified` on the `portal_api_configs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "portal_api_configs" DROP COLUMN "is_verified";
ALTER TABLE "portal_api_configs" DROP COLUMN "last_verified";
