/*
  Warnings:

  - A unique constraint covering the columns `[org_code,mapping_type]` on the table `field_mappings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mapping_type` to the `field_mappings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "field_mappings_org_code_key";

-- AlterTable
ALTER TABLE "field_mappings" ADD COLUMN     "mapping_type" STRING(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "field_mappings_org_code_mapping_type_key" ON "field_mappings"("org_code", "mapping_type");
