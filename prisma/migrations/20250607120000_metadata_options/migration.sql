-- CreateEnum
CREATE TYPE "MetadataType" AS ENUM ('platform', 'project_type', 'pricing_type');

-- CreateTable
CREATE TABLE "metadata_options" (
    "id" TEXT NOT NULL,
    "type" "MetadataType" NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metadata_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "metadata_options_type_value_key" ON "metadata_options"("type", "value");

-- Convert product enum columns to text
ALTER TABLE "products" ALTER COLUMN "project_type" TYPE TEXT USING "project_type"::TEXT;
ALTER TABLE "products" ALTER COLUMN "pricing_type" TYPE TEXT USING "pricing_type"::TEXT;
ALTER TABLE "products" ALTER COLUMN "platforms" TYPE TEXT[] USING "platforms"::TEXT[];

-- DropEnum
DROP TYPE "ProjectType";
DROP TYPE "Platform";
DROP TYPE "PricingType";
