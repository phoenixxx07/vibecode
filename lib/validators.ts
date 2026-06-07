import { z } from "zod";

export function buildProductSubmitSchema(values: {
  projectTypes: string[];
  platforms: string[];
  pricingTypes: string[];
}) {
  const projectTypeSchema =
    values.projectTypes.length > 0
      ? z.enum(values.projectTypes as [string, ...string[]])
      : z.string().min(1);

  const platformSchema =
    values.platforms.length > 0
      ? z.enum(values.platforms as [string, ...string[]])
      : z.string().min(1);

  const pricingTypeSchema =
    values.pricingTypes.length > 0
      ? z.enum(values.pricingTypes as [string, ...string[]])
      : z.string();

  return z.object({
    name: z.string().min(2).max(100),
    tagline: z.string().min(5).max(80),
    url: z.string().url(),
    githubUrl: z.string().url().optional().or(z.literal("")),
    projectType: projectTypeSchema,
    highlight1: z.string().min(3).max(120),
    highlight2: z.string().min(3).max(120),
    highlight3: z.string().min(3).max(120),
    categoryIds: z.array(z.string()).min(1, "Pilih minimal 1 kategori"),
    platforms: z.array(platformSchema).min(1, "Pilih minimal 1 platform"),
    aiToolIds: z.array(z.string()).min(1, "Pilih minimal 1 AI tool"),
    techStack: z.array(z.string()).optional(),
    pricingType: pricingTypeSchema.optional().nullable(),
    priceAmount: z.coerce.number().positive().optional().nullable(),
    priceCurrency: z.string().optional().nullable(),
    pricingNote: z.string().max(200).optional().nullable(),
    developerContact: z.string().min(3).max(200),
  });
}

export const adminReviewSchema = z.object({
  productId: z.string().uuid(),
  status: z.enum(["approved", "rejected"]),
  rejectionReason: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

export const adminProductUpdateSchema = z.object({
  isFeatured: z.boolean().optional(),
  status: z.enum(["approved", "rejected", "pending"]).optional(),
  rejectionReason: z.string().max(200).optional(),
});

export const adminPromoteSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

export const adminUserRoleSchema = z.object({
  role: z.enum(["admin", "user"]),
});

export const clickSchema = z.object({
  type: z.enum(["visit", "contact"]),
});

export const categoryCreateSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  icon: z.string().max(50).optional().nullable(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export const aiToolCreateSchema = z.object({
  name: z.string().min(2).max(100),
  website: z.string().url().optional().or(z.literal("")).nullable(),
  logoUrl: z.string().url().optional().or(z.literal("")).nullable(),
  isApproved: z.boolean().optional(),
});

export const aiToolUpdateSchema = aiToolCreateSchema.partial();

export const metadataOptionCreateSchema = z.object({
  type: z.enum(["platform", "project_type", "pricing_type"]),
  value: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9_]+$/)
    .optional(),
  label: z.string().min(2).max(80),
  icon: z.string().max(50).optional().nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const metadataOptionUpdateSchema = metadataOptionCreateSchema
  .omit({ type: true })
  .partial();

export const metadataRequestSchema = z.object({
  kind: z.enum(["category", "ai_tool", "platform", "project_type", "pricing_type"]),
  label: z.string().min(2).max(80),
  value: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9_-]+$/)
    .optional()
    .or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  icon: z.string().max(50).optional().or(z.literal("")),
});

export const metadataRequestReviewSchema = z.object({
  requestId: z.string().uuid(),
  status: z.enum(["approved", "rejected"]),
});

export function buildProjectRequestSchema(values: { projectTypes: string[] }) {
  const projectTypeSchema =
    values.projectTypes.length > 0
      ? z.enum(values.projectTypes as [string, ...string[]])
      : z.string().min(1);

  return z.object({
    title: z.string().min(3).max(120),
    description: z.string().min(10).max(2000),
    workflowDescription: z.string().min(10).max(5000),
    specifications: z.string().max(2000).optional().or(z.literal("")),
    features: z.string().min(1).max(5000),
    deadline: z.coerce.date().refine((d) => d > new Date(), {
      message: "Deadline harus di masa depan",
    }),
    budgetAmount: z.coerce.number().positive("Estimasi biaya harus lebih dari 0"),
    budgetCurrency: z.string().min(3).max(3).default("IDR"),
    budgetNote: z.string().max(500).optional().or(z.literal("")),
    projectType: projectTypeSchema,
    categoryIds: z.array(z.string().uuid()).min(1, "Pilih minimal 1 kategori"),
  });
}

export const projectRequestApplicationSchema = z.object({
  pitchMessage: z.string().max(500).optional().or(z.literal("")),
});

export const projectRequestMessageSchema = z.object({
  applicationId: z.string().uuid(),
  body: z.string().trim().min(1).max(2000),
});

export const projectRequestReviewSchema = z.object({
  requestId: z.string().uuid(),
  status: z.enum(["published", "rejected"]),
  rejectionReason: z.string().max(500).optional(),
});

export function buildProductUpdateSchema(values: {
  projectTypes: string[];
  platforms: string[];
  pricingTypes: string[];
}) {
  return buildProductSubmitSchema(values).partial().extend({
    name: z.string().min(2).max(100).optional(),
  });
}
