import { MetadataType } from "@prisma/client";
import { prisma } from "./prisma";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function metadataValue(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_");
}

export async function getMetadataOptions(type: MetadataType, activeOnly = true) {
  return prisma.metadataOption.findMany({
    where: { type, ...(activeOnly && { isActive: true }) },
    orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
  });
}

export async function getMetadataLabels(type: MetadataType) {
  const options = await getMetadataOptions(type);
  return Object.fromEntries(options.map((o) => [o.value, o.label]));
}

export async function getFormMetadata() {
  const [categories, aiTools, platforms, projectTypes, pricingTypes] =
    await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.aiTool.findMany({
        where: { isApproved: true },
        orderBy: { name: "asc" },
      }),
      getMetadataOptions("platform"),
      getMetadataOptions("project_type"),
      getMetadataOptions("pricing_type"),
    ]);

  return { categories, aiTools, platforms, projectTypes, pricingTypes };
}

export async function getAdminMetadata() {
  const [categories, aiTools, platforms, projectTypes, pricingTypes] =
    await Promise.all([
      prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
      }),
      prisma.aiTool.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
      }),
      getMetadataOptions("platform", false),
      getMetadataOptions("project_type", false),
      getMetadataOptions("pricing_type", false),
    ]);

  return { categories, aiTools, platforms, projectTypes, pricingTypes };
}

export async function getMetadataValidationValues() {
  const [projectTypes, platforms, pricingTypes] = await Promise.all([
    getMetadataOptions("project_type"),
    getMetadataOptions("platform"),
    getMetadataOptions("pricing_type"),
  ]);

  return {
    projectTypes: projectTypes.map((o) => o.value),
    platforms: platforms.map((o) => o.value),
    pricingTypes: pricingTypes.map((o) => o.value),
  };
}
