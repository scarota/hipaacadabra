-- AlterTable
ALTER TABLE "portal_api_configs" ADD COLUMN     "auth_type" STRING(20) NOT NULL DEFAULT 'bearer';
