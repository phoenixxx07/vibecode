-- CreateEnum
CREATE TYPE "ProjectRequestKind" AS ENUM ('project', 'tool');

-- CreateEnum
CREATE TYPE "ProjectRequestStatus" AS ENUM ('submission', 'published', 'rejected', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ProjectRequestApplicationStatus" AS ENUM ('active', 'selected', 'withdrawn');

-- CreateTable
CREATE TABLE "project_requests" (
    "id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "kind" "ProjectRequestKind" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "workflow_description" TEXT NOT NULL,
    "specifications" TEXT,
    "features" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "budget_amount" DECIMAL(12,2) NOT NULL,
    "budget_currency" TEXT NOT NULL DEFAULT 'IDR',
    "budget_note" TEXT,
    "project_type" TEXT,
    "status" "ProjectRequestStatus" NOT NULL DEFAULT 'submission',
    "assigned_developer_id" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "cancellation_requested_by_id" TEXT,
    "cancellation_requested_at" TIMESTAMP(3),
    "cancellation_approved_by_id" TEXT,
    "source_request_id" TEXT,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_request_applications" (
    "id" TEXT NOT NULL,
    "project_request_id" TEXT NOT NULL,
    "developer_id" TEXT NOT NULL,
    "pitch_message" TEXT,
    "status" "ProjectRequestApplicationStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_request_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_request_messages" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_request_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_requests_status_idx" ON "project_requests"("status");

-- CreateIndex
CREATE INDEX "project_requests_requester_id_idx" ON "project_requests"("requester_id");

-- CreateIndex
CREATE INDEX "project_requests_created_at_idx" ON "project_requests"("created_at");

-- CreateIndex
CREATE INDEX "project_request_applications_project_request_id_idx" ON "project_request_applications"("project_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_request_applications_project_request_id_developer_id_key" ON "project_request_applications"("project_request_id", "developer_id");

-- CreateIndex
CREATE INDEX "project_request_messages_application_id_idx" ON "project_request_messages"("application_id");

-- AddForeignKey
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_assigned_developer_id_fkey" FOREIGN KEY ("assigned_developer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_cancellation_requested_by_id_fkey" FOREIGN KEY ("cancellation_requested_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_cancellation_approved_by_id_fkey" FOREIGN KEY ("cancellation_approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_source_request_id_fkey" FOREIGN KEY ("source_request_id") REFERENCES "project_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_request_applications" ADD CONSTRAINT "project_request_applications_project_request_id_fkey" FOREIGN KEY ("project_request_id") REFERENCES "project_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_request_applications" ADD CONSTRAINT "project_request_applications_developer_id_fkey" FOREIGN KEY ("developer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_request_messages" ADD CONSTRAINT "project_request_messages_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "project_request_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_request_messages" ADD CONSTRAINT "project_request_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
