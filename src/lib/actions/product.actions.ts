"use server";
import { prisma } from "@/db/prisma";

//convert prisma to plain onject
import { convertToPlainObject } from "../utils";

//const latest Product Limit
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// Get the latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
