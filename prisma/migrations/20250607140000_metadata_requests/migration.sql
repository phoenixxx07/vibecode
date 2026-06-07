-- CreateEnum
CREATE TYPE "MetadataRequestKind" AS ENUM ('category', 'ai_tool', 'platform', 'project_type', 'pricing_type');

-- CreateEnum
CREATE TYPE "MetadataRequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "metadata_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "kind" "MetadataRequestKind" NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT,
    "website" TEXT,
    "icon" TEXT,
    "status" "MetadataRequestStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metadata_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "metadata_requests_status_idx" ON "metadata_requests"("status");

-- CreateIndex
CREATE INDEX "metadata_requests_kind_idx" ON "metadata_requests"("kind");

-- AddForeignKey
ALTER TABLE "metadata_requests" ADD CONSTRAINT "metadata_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
