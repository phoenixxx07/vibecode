-- CreateTable
CREATE TABLE "project_request_categories" (
    "project_request_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "project_request_categories_pkey" PRIMARY KEY ("project_request_id","category_id")
);

-- Backfill project_type for rows that only had kind
UPDATE "project_requests"
SET "project_type" = 'live'
WHERE "project_type" IS NULL;

-- Make project_type required
ALTER TABLE "project_requests" ALTER COLUMN "project_type" SET NOT NULL;

-- Drop kind column and enum
ALTER TABLE "project_requests" DROP COLUMN "kind";
DROP TYPE IF EXISTS "ProjectRequestKind";

-- CreateIndex
CREATE INDEX "project_requests_project_type_idx" ON "project_requests"("project_type");

-- AddForeignKey
ALTER TABLE "project_request_categories" ADD CONSTRAINT "project_request_categories_project_request_id_fkey" FOREIGN KEY ("project_request_id") REFERENCES "project_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_request_categories" ADD CONSTRAINT "project_request_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
