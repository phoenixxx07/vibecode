import {
  MetadataRequestKind,
  MetadataRequestStatus,
  MetadataType,
} from "@prisma/client";
import { metadataValue, slugify } from "./metadata";
import { prisma } from "./prisma";

const KIND_TO_METADATA_TYPE: Partial<Record<MetadataRequestKind, MetadataType>> = {
  platform: "platform",
  project_type: "project_type",
  pricing_type: "pricing_type",
};

export async function getPendingMetadataRequests() {
  return prisma.metadataRequest.findMany({
    where: { status: MetadataRequestStatus.pending },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

async function labelExists(kind: MetadataRequestKind, label: string): Promise<boolean> {
  if (kind === "category") {
    const existing = await prisma.category.findFirst({
      where: { name: { equals: label, mode: "insensitive" } },
    });
    return !!existing;
  }

  if (kind === "ai_tool") {
    const existing = await prisma.aiTool.findFirst({
      where: { name: { equals: label, mode: "insensitive" } },
    });
    return !!existing;
  }

  const metadataType = KIND_TO_METADATA_TYPE[kind];
  if (!metadataType) return false;

  const existing = await prisma.metadataOption.findFirst({
    where: {
      type: metadataType,
      label: { equals: label, mode: "insensitive" },
    },
  });
  return !!existing;
}

export async function createMetadataRequest(
  userId: string,
  data: {
    kind: MetadataRequestKind;
    label: string;
    value?: string;
    website?: string;
    icon?: string;
  }
) {
  const label = data.label.trim();

  if (await labelExists(data.kind, label)) {
    throw new Error("Nama sudah ada di katalog");
  }

  const pendingDuplicate = await prisma.metadataRequest.findFirst({
    where: {
      kind: data.kind,
      label: { equals: label, mode: "insensitive" },
      status: MetadataRequestStatus.pending,
    },
  });
  if (pendingDuplicate) {
    throw new Error("Pengajuan serupa sedang menunggu review admin");
  }

  return prisma.metadataRequest.create({
    data: {
      userId,
      kind: data.kind,
      label,
      value: data.value?.trim() || null,
      website: data.website?.trim() || null,
      icon: data.icon?.trim() || null,
    },
  });
}

export async function reviewMetadataRequest(
  requestId: string,
  status: "approved" | "rejected"
) {
  const request = await prisma.metadataRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) throw new Error("Pengajuan tidak ditemukan");
  if (request.status !== MetadataRequestStatus.pending) {
    throw new Error("Pengajuan sudah diproses");
  }

  if (status === "rejected") {
    return prisma.metadataRequest.update({
      where: { id: requestId },
      data: { status: MetadataRequestStatus.rejected },
    });
  }

  if (await labelExists(request.kind, request.label)) {
    throw new Error("Nama sudah ada di katalog");
  }

  return prisma.$transaction(async (tx) => {
    if (request.kind === "category") {
      const slug = request.value?.trim() || slugify(request.label);
      await tx.category.create({
        data: {
          name: request.label,
          slug,
          icon: request.icon,
        },
      });
    } else if (request.kind === "ai_tool") {
      await tx.aiTool.create({
        data: {
          name: request.label,
          website: request.website,
          isApproved: true,
        },
      });
    } else {
      const metadataType = KIND_TO_METADATA_TYPE[request.kind];
      if (!metadataType) throw new Error("Jenis metadata tidak valid");

      const value = request.value?.trim() || metadataValue(request.label);
      await tx.metadataOption.create({
        data: {
          type: metadataType,
          value,
          label: request.label,
          icon: request.icon,
        },
      });
    }

    return tx.metadataRequest.update({
      where: { id: requestId },
      data: { status: MetadataRequestStatus.approved },
    });
  });
}
