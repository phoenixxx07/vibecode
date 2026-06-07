import { Prisma } from "@prisma/client";
import { productInclude } from "@/lib/products";

type ProductFromDb = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

export type ProductWithRelations = Omit<ProductFromDb, "priceAmount"> & {
  priceAmount: number | null;
};
