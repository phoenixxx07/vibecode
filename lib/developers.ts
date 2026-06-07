import { ProductStatus } from "@prisma/client";
import { getProducts } from "./products";
import { prisma } from "./prisma";

export async function getDeveloperPortfolio(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      socialLink: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  const { products } = await getProducts({
    userId,
    status: ProductStatus.approved,
    limit: 50,
  });

  const stats = await prisma.product.aggregate({
    where: { userId, status: ProductStatus.approved },
    _count: { id: true },
    _sum: { upvoteCount: true },
  });

  return {
    ...user,
    stats: {
      approvedCount: stats._count.id,
      totalUpvotes: stats._sum.upvoteCount ?? 0,
    },
    products,
  };
}
