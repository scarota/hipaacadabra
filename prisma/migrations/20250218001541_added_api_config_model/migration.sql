-- CreateTable
CREATE TABLE "portal_api_configs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "org_code" STRING(20) NOT NULL,
    "api_key" STRING(255) NOT NULL,
    "base_url" STRING(255) NOT NULL,
    "is_verified" BOOL NOT NULL DEFAULT false,
    "last_verified" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_api_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "portal_api_configs_org_code_key" ON "portal_api_configs"("org_code");
