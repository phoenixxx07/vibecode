import {
  Prisma,
  ProjectRequestApplicationStatus,
  ProjectRequestStatus,
} from "@prisma/client";
import { normalizePagination } from "./pagination";
import { prisma } from "./prisma";

const userSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  socialLink: true,
} as const;

export const projectRequestInclude = {
  requester: { select: userSelect },
  assignedDeveloper: { select: userSelect },
  cancellationRequestedBy: { select: userSelect },
  applications: {
    include: {
      developer: { select: userSelect },
      messages: {
        orderBy: { createdAt: "desc" as const },
        take: 1,
        include: { sender: { select: userSelect } },
      },
      _count: { select: { messages: true } },
    },
    orderBy: { createdAt: "asc" as const },
  },
  categories: { include: { category: true } },
  _count: { select: { applications: true } },
} satisfies Prisma.ProjectRequestInclude;

export type ProjectRequestWithRelations = Prisma.ProjectRequestGetPayload<{
  include: typeof projectRequestInclude;
}>;

export function serializeProjectRequest(request: ProjectRequestWithRelations) {
  return {
    ...request,
    budgetAmount: Number(request.budgetAmount),
    agreedBudgetAmount:
      request.agreedBudgetAmount != null ? Number(request.agreedBudgetAmount) : null,
  };
}

const PUBLIC_STATUSES: ProjectRequestStatus[] = [
  ProjectRequestStatus.published,
  ProjectRequestStatus.in_progress,
  ProjectRequestStatus.completed,
];

export function canViewRequest(
  request: { status: ProjectRequestStatus; requesterId: string },
  viewerId?: string | null,
  isAdmin?: boolean
): boolean {
  if (isAdmin) return true;
  if (viewerId && request.requesterId === viewerId) return true;
  return PUBLIC_STATUSES.includes(request.status);
}

export async function getRequestCatalogStats() {
  const [open, inProgress, completed] = await Promise.all([
    prisma.projectRequest.count({ where: { status: ProjectRequestStatus.published } }),
    prisma.projectRequest.count({ where: { status: ProjectRequestStatus.in_progress } }),
    prisma.projectRequest.count({ where: { status: ProjectRequestStatus.completed } }),
  ]);
  return { open, inProgress, completed, total: open + inProgress + completed };
}

const pendingProjectRequestInclude = {
  requester: { select: userSelect },
  categories: { include: { category: true } },
} satisfies Prisma.ProjectRequestInclude;

export type PendingProjectRequest = Prisma.ProjectRequestGetPayload<{
  include: typeof pendingProjectRequestInclude;
}>;

export type SerializedPendingProjectRequest = Omit<
  PendingProjectRequest,
  "budgetAmount" | "agreedBudgetAmount"
> & {
  budgetAmount: number;
  agreedBudgetAmount: number | null;
};

export async function getPendingProjectRequests(): Promise<SerializedPendingProjectRequest[]> {
  const requests = await prisma.projectRequest.findMany({
    where: { status: ProjectRequestStatus.submission },
    orderBy: { createdAt: "asc" },
    include: pendingProjectRequestInclude,
  });

  return requests.map((request) => ({
    ...request,
    budgetAmount: Number(request.budgetAmount),
    agreedBudgetAmount:
      request.agreedBudgetAmount != null ? Number(request.agreedBudgetAmount) : null,
  }));
}

const approvedProjectRequestInclude = {
  requester: { select: userSelect },
  assignedDeveloper: { select: userSelect },
  categories: { include: { category: true } },
  _count: { select: { applications: true } },
} satisfies Prisma.ProjectRequestInclude;

export type ApprovedProjectRequest = Prisma.ProjectRequestGetPayload<{
  include: typeof approvedProjectRequestInclude;
}>;

export type SerializedApprovedProjectRequest = Omit<
  ApprovedProjectRequest,
  "budgetAmount" | "agreedBudgetAmount"
> & {
  budgetAmount: number;
  agreedBudgetAmount: number | null;
};

const ADMIN_APPROVED_STATUSES: ProjectRequestStatus[] = [
  ProjectRequestStatus.published,
  ProjectRequestStatus.in_progress,
  ProjectRequestStatus.completed,
  ProjectRequestStatus.cancelled,
];

export async function getApprovedProjectRequests(
  limit = 100
): Promise<SerializedApprovedProjectRequest[]> {
  const requests = await prisma.projectRequest.findMany({
    where: { status: { in: ADMIN_APPROVED_STATUSES } },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: approvedProjectRequestInclude,
  });

  return requests.map((request) => ({
    ...request,
    budgetAmount: Number(request.budgetAmount),
    agreedBudgetAmount:
      request.agreedBudgetAmount != null ? Number(request.agreedBudgetAmount) : null,
  }));
}

export async function getPublicProjectRequests(filters: {
  status?: ProjectRequestStatus;
  projectType?: string;
  categorySlug?: string;
  q?: string;
  page?: number;
  limit?: number;
} = {}) {
  const {
    status = ProjectRequestStatus.published,
    projectType,
    categorySlug,
    q,
    page: rawPage,
    limit: rawLimit,
  } = filters;
  const { page, limit } = normalizePagination(rawPage, rawLimit);

  const where: Prisma.ProjectRequestWhereInput = {
    ...(q ? { status: { in: PUBLIC_STATUSES } } : { status }),
    ...(projectType && { projectType }),
    ...(categorySlug && {
      categories: { some: { category: { slug: categorySlug } } },
    }),
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { workflowDescription: { contains: q, mode: "insensitive" } },
        { specifications: { contains: q, mode: "insensitive" } },
        { features: { contains: q, mode: "insensitive" } },
        {
          categories: {
            some: { category: { name: { contains: q, mode: "insensitive" } } },
          },
        },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.projectRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: projectRequestInclude,
    }),
    prisma.projectRequest.count({ where }),
  ]);

  return {
    items: items.map(serializeProjectRequest),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getUserProjectRequests(userId: string) {
  const items = await prisma.projectRequest.findMany({
    where: { requesterId: userId },
    orderBy: { createdAt: "desc" },
    include: projectRequestInclude,
  });
  return items.map(serializeProjectRequest);
}

export async function getUserApplications(userId: string) {
  return prisma.projectRequestApplication.findMany({
    where: { developerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      projectRequest: { include: projectRequestInclude },
    },
  });
}

export async function getProjectRequestById(id: string) {
  const request = await prisma.projectRequest.findUnique({
    where: { id },
    include: projectRequestInclude,
  });
  return request ? serializeProjectRequest(request) : null;
}

export type CreateProjectRequestData = {
  title: string;
  description: string;
  workflowDescription: string;
  specifications?: string;
  features: string;
  deadline: Date;
  budgetAmount: number;
  budgetCurrency: string;
  budgetNote?: string;
  projectType: string;
  categoryIds: string[];
  sourceRequestId?: string;
};

export async function createProjectRequest(userId: string, data: CreateProjectRequestData) {
  return prisma.projectRequest.create({
    data: {
      requesterId: userId,
      title: data.title.trim(),
      description: data.description.trim(),
      workflowDescription: data.workflowDescription.trim(),
      specifications: data.specifications?.trim() || null,
      features: data.features.trim(),
      deadline: data.deadline,
      budgetAmount: data.budgetAmount,
      budgetCurrency: data.budgetCurrency || "IDR",
      budgetNote: data.budgetNote?.trim() || null,
      projectType: data.projectType,
      sourceRequestId: data.sourceRequestId || null,
      status: ProjectRequestStatus.submission,
      categories: {
        create: data.categoryIds.map((categoryId) => ({ categoryId })),
      },
    },
    include: projectRequestInclude,
  });
}

export async function reviewProjectRequest(
  requestId: string,
  status: "published" | "rejected",
  rejectionReason?: string
) {
  const request = await prisma.projectRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error("Request tidak ditemukan");
  if (request.status !== ProjectRequestStatus.submission) {
    throw new Error("Request sudah diproses");
  }

  return prisma.projectRequest.update({
    where: { id: requestId },
    data: {
      status: status === "published" ? ProjectRequestStatus.published : ProjectRequestStatus.rejected,
      rejectionReason: status === "rejected" ? rejectionReason || "Tidak memenuhi guidelines" : null,
    },
    include: projectRequestInclude,
  });
}

export async function applyToProjectRequest(
  requestId: string,
  developerId: string,
  pitchMessage?: string
) {
  const request = await prisma.projectRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error("Request tidak ditemukan");
  if (request.status !== ProjectRequestStatus.published) {
    throw new Error("Request tidak menerima pendaftaran");
  }
  if (request.requesterId === developerId) {
    throw new Error("Tidak bisa mendaftar pada request sendiri");
  }

  const existing = await prisma.projectRequestApplication.findUnique({
    where: { projectRequestId_developerId: { projectRequestId: requestId, developerId } },
  });

  if (existing) {
    if (existing.status === ProjectRequestApplicationStatus.withdrawn) {
      return prisma.projectRequestApplication.update({
        where: { id: existing.id },
        data: {
          status: ProjectRequestApplicationStatus.active,
          pitchMessage: pitchMessage?.trim() || existing.pitchMessage,
        },
        include: { developer: { select: userSelect } },
      });
    }
    throw new Error("Anda sudah terdaftar pada request ini");
  }

  return prisma.projectRequestApplication.create({
    data: {
      projectRequestId: requestId,
      developerId,
      pitchMessage: pitchMessage?.trim() || null,
    },
    include: { developer: { select: userSelect } },
  });
}

export async function selectDeveloper(
  requestId: string,
  applicationId: string,
  requesterId: string,
  agreedBudgetAmount?: number
) {
  const request = await prisma.projectRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error("Request tidak ditemukan");
  if (request.requesterId !== requesterId) throw new Error("Unauthorized");
  if (request.status !== ProjectRequestStatus.published) {
    throw new Error("Request tidak dalam fase pemilihan developer");
  }

  const application = await prisma.projectRequestApplication.findUnique({
    where: { id: applicationId },
  });
  if (!application || application.projectRequestId !== requestId) {
    throw new Error("Pendaftaran tidak ditemukan");
  }

  if (agreedBudgetAmount != null) {
    if (!Number.isFinite(agreedBudgetAmount) || agreedBudgetAmount <= 0) {
      throw new Error("Harga kesepakatan harus lebih dari 0");
    }
  }

  return prisma.$transaction(async (tx) => {
    await tx.projectRequestApplication.updateMany({
      where: { projectRequestId: requestId, id: { not: applicationId } },
      data: { status: ProjectRequestApplicationStatus.withdrawn },
    });
    await tx.projectRequestApplication.update({
      where: { id: applicationId },
      data: { status: ProjectRequestApplicationStatus.selected },
    });
    return tx.projectRequest.update({
      where: { id: requestId },
      data: {
        status: ProjectRequestStatus.in_progress,
        assignedDeveloperId: application.developerId,
        agreedBudgetAmount: agreedBudgetAmount ?? null,
        startedAt: new Date(),
      },
      include: projectRequestInclude,
    });
  });
}

export async function completeProjectRequest(requestId: string, requesterId: string) {
  const request = await prisma.projectRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error("Request tidak ditemukan");
  if (request.requesterId !== requesterId) throw new Error("Unauthorized");
  if (request.status !== ProjectRequestStatus.in_progress) {
    throw new Error("Request tidak dalam pengerjaan");
  }

  return prisma.projectRequest.update({
    where: { id: requestId },
    data: {
      status: ProjectRequestStatus.completed,
      completedAt: new Date(),
    },
    include: projectRequestInclude,
  });
}

export async function requestCancellation(requestId: string, userId: string) {
  const request = await prisma.projectRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error("Request tidak ditemukan");
  if (request.status !== ProjectRequestStatus.in_progress) {
    throw new Error("Pembatalan hanya bisa saat dalam pengerjaan");
  }
  const isRequester = request.requesterId === userId;
  const isDeveloper = request.assignedDeveloperId === userId;
  if (!isRequester && !isDeveloper) throw new Error("Unauthorized");
  if (request.cancellationRequestedById) {
    throw new Error("Sudah ada pengajuan pembatalan yang menunggu");
  }

  return prisma.projectRequest.update({
    where: { id: requestId },
    data: {
      cancellationRequestedById: userId,
      cancellationRequestedAt: new Date(),
    },
    include: projectRequestInclude,
  });
}

export async function approveCancellation(requestId: string, userId: string) {
  const request = await prisma.projectRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error("Request tidak ditemukan");
  if (request.status !== ProjectRequestStatus.in_progress) {
    throw new Error("Request tidak dalam pengerjaan");
  }
  if (!request.cancellationRequestedById) {
    throw new Error("Tidak ada pengajuan pembatalan");
  }
  if (request.cancellationRequestedById === userId) {
    throw new Error("Tidak bisa menyetujui pengajuan sendiri");
  }
  const isRequester = request.requesterId === userId;
  const isDeveloper = request.assignedDeveloperId === userId;
  if (!isRequester && !isDeveloper) throw new Error("Unauthorized");

  return prisma.projectRequest.update({
    where: { id: requestId },
    data: {
      status: ProjectRequestStatus.cancelled,
      cancelledAt: new Date(),
      cancellationApprovedById: userId,
    },
    include: projectRequestInclude,
  });
}

export async function rejectCancellation(requestId: string, userId: string) {
  const request = await prisma.projectRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error("Request tidak ditemukan");
  if (!request.cancellationRequestedById) {
    throw new Error("Tidak ada pengajuan pembatalan");
  }
  if (request.cancellationRequestedById === userId) {
    throw new Error("Tidak bisa menolak pengajuan sendiri");
  }
  const isRequester = request.requesterId === userId;
  const isDeveloper = request.assignedDeveloperId === userId;
  if (!isRequester && !isDeveloper) throw new Error("Unauthorized");

  return prisma.projectRequest.update({
    where: { id: requestId },
    data: {
      cancellationRequestedById: null,
      cancellationRequestedAt: null,
    },
    include: projectRequestInclude,
  });
}

export async function reopenProjectRequest(requestId: string, requesterId: string) {
  const request = await prisma.projectRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error("Request tidak ditemukan");
  if (request.requesterId !== requesterId) throw new Error("Unauthorized");
  if (request.status !== ProjectRequestStatus.cancelled) {
    throw new Error("Hanya request dibatalkan yang bisa dibuka kembali");
  }

  return prisma.$transaction(async (tx) => {
    await tx.projectRequestApplication.updateMany({
      where: { projectRequestId: requestId },
      data: { status: ProjectRequestApplicationStatus.withdrawn },
    });
    return tx.projectRequest.update({
      where: { id: requestId },
      data: {
        status: ProjectRequestStatus.published,
        assignedDeveloperId: null,
        agreedBudgetAmount: null,
        startedAt: null,
        completedAt: null,
        cancelledAt: null,
        cancellationRequestedById: null,
        cancellationRequestedAt: null,
        cancellationApprovedById: null,
      },
      include: projectRequestInclude,
    });
  });
}

export async function duplicateProjectRequest(requestId: string, requesterId: string) {
  const request = await prisma.projectRequest.findUnique({
    where: { id: requestId },
    include: { categories: true },
  });
  if (!request) throw new Error("Request tidak ditemukan");
  if (request.requesterId !== requesterId) throw new Error("Unauthorized");
  if (request.status !== ProjectRequestStatus.completed) {
    throw new Error("Hanya request selesai yang bisa diduplikat");
  }

  return createProjectRequest(requesterId, {
    title: `${request.title} (salinan)`,
    description: request.description,
    workflowDescription: request.workflowDescription,
    specifications: request.specifications ?? undefined,
    features: request.features,
    deadline: request.deadline,
    budgetAmount: Number(request.budgetAmount),
    budgetCurrency: request.budgetCurrency,
    budgetNote: request.budgetNote ?? undefined,
    projectType: request.projectType,
    categoryIds: request.categories.map((c) => c.categoryId),
    sourceRequestId: request.id,
  });
}

function canAccessApplication(
  request: { requesterId: string; status: ProjectRequestStatus; assignedDeveloperId: string | null },
  application: { developerId: string },
  viewerId: string
): boolean {
  if (request.requesterId === viewerId) return true;
  if (application.developerId === viewerId) return true;
  return false;
}

function canSendMessage(
  request: {
    requesterId: string;
    status: ProjectRequestStatus;
    assignedDeveloperId: string | null;
    cancellationRequestedById: string | null;
  },
  application: { developerId: string },
  senderId: string
): boolean {
  if (request.cancellationRequestedById) return false;

  if (request.status === ProjectRequestStatus.published) {
    return request.requesterId === senderId || application.developerId === senderId;
  }

  if (request.status === ProjectRequestStatus.in_progress) {
    const isParticipant =
      request.requesterId === senderId || request.assignedDeveloperId === senderId;
    const isSelectedThread = application.developerId === request.assignedDeveloperId;
    return isParticipant && isSelectedThread;
  }

  return false;
}

export async function getMessages(applicationId: string, viewerId: string) {
  const application = await prisma.projectRequestApplication.findUnique({
    where: { id: applicationId },
    include: { projectRequest: true },
  });
  if (!application) throw new Error("Thread tidak ditemukan");
  if (!canAccessApplication(application.projectRequest, application, viewerId)) {
    throw new Error("Unauthorized");
  }

  return prisma.projectRequestMessage.findMany({
    where: { applicationId },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: userSelect } },
  });
}

const messageRateLimit = new Map<string, number[]>();

function checkMessageRateLimit(userId: string, applicationId: string): boolean {
  const key = `${userId}:${applicationId}`;
  const now = Date.now();
  const window = 60 * 60 * 1000;
  const max = 30;
  const timestamps = (messageRateLimit.get(key) ?? []).filter((t) => now - t < window);
  if (timestamps.length >= max) return false;
  timestamps.push(now);
  messageRateLimit.set(key, timestamps);
  return true;
}

export async function sendMessage(applicationId: string, senderId: string, body: string) {
  if (!checkMessageRateLimit(senderId, applicationId)) {
    throw new Error("Rate limit exceeded. Max 30 pesan per jam per thread.");
  }

  const application = await prisma.projectRequestApplication.findUnique({
    where: { id: applicationId },
    include: { projectRequest: true },
  });
  if (!application) throw new Error("Thread tidak ditemukan");
  if (!canAccessApplication(application.projectRequest, application, senderId)) {
    throw new Error("Unauthorized");
  }
  if (!canSendMessage(application.projectRequest, application, senderId)) {
    throw new Error("Tidak bisa mengirim pesan pada fase ini");
  }

  return prisma.projectRequestMessage.create({
    data: {
      applicationId,
      senderId,
      body: body.trim(),
    },
    include: { sender: { select: userSelect } },
  });
}

export async function canAccessRequestChat(requestId: string, userId: string) {
  const request = await prisma.projectRequest.findUnique({
    where: { id: requestId },
    select: {
      requesterId: true,
      applications: { select: { developerId: true } },
    },
  });
  if (!request) return false;
  if (request.requesterId === userId) return true;
  return request.applications.some((app) => app.developerId === userId);
}

export async function getConversationsForRequest(requestId: string, viewerId: string) {
  const request = await prisma.projectRequest.findUnique({
    where: { id: requestId },
    include: {
      requester: { select: userSelect },
      applications: {
        include: {
          developer: { select: userSelect },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: { select: { messages: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!request) throw new Error("Request tidak ditemukan");

  const isRequester = request.requesterId === viewerId;
  let applications = request.applications;

  if (!isRequester) {
    applications = applications.filter((a) => a.developerId === viewerId);
    if (applications.length === 0 && request.requesterId !== viewerId) {
      throw new Error("Unauthorized");
    }
  }

  return applications
    .map((app) => ({
      id: app.id,
      developer: app.developer,
      contact: isRequester ? app.developer : request.requester,
      pitchMessage: app.pitchMessage,
      status: app.status,
      messageCount: app._count.messages,
      lastMessage: app.messages[0]
        ? {
            body: app.messages[0].body,
            createdAt: app.messages[0].createdAt.toISOString(),
            senderId: app.messages[0].senderId,
          }
        : null,
    }))
    .sort((a, b) => {
      const aTime = a.lastMessage?.createdAt ?? "";
      const bTime = b.lastMessage?.createdAt ?? "";
      return bTime.localeCompare(aTime);
    });
}
