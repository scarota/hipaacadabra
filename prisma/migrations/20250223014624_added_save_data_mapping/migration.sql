-- CreateTable
CREATE TABLE "field_mappings" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "org_code" STRING(20) NOT NULL,
    "endpoint" STRING(255) NOT NULL,
    "mappings" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "field_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "field_mappings_org_code_key" ON "field_mappings"("org_code");

-- AddForeignKey
ALTER TABLE "field_mappings" ADD CONSTRAINT "field_mappings_org_code_fkey" FOREIGN KEY ("org_code") REFERENCES "portal_api_configs"("org_code") ON DELETE RESTRICT ON UPDATE CASCADE;
