"use server";
import { prisma } from "@/db/prisma";

//convert prisma to plain onject
import { convertToPlainObject, formatError } from "../utils";

//zod
import type { z } from "zod";

//const latest Product Limit
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";

//revalidatePath
import { revalidatePath } from "next/cache";

//Product Schema
import { insertProductSchema, updateProductSchema } from "../validators";
import type { Prisma } from "@prisma/client";

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

// Get single product by id
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  return convertToPlainObject(data);
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  // Category filter
  const categoryFilter = category && category !== "all" ? { category } : {};

  // Price filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  // Rating filter
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
          ? { price: "desc" }
          : sort === "rating"
            ? { rating: "desc" }
            : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data: convertToPlainObject(data),
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete Product
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.delete({ where: { id } });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Create Product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    // Validate and create product
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update Product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    // Validate and find product
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error("Product not found");

    // Update product
    await prisma.product.update({ where: { id: product.id }, data: product });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
      banner: {
        not: null,
        notIn: [""],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return convertToPlainObject(data);
}

export async function getProductPriceRange() {
  const minResult = await prisma.product.aggregate({
    _min: { price: true },
  });

  const maxResult = await prisma.product.aggregate({
    _max: { price: true },
  });

  return {
    min: minResult._min.price ? Number(minResult._min.price) : 0,
    max: maxResult._max.price ? Number(maxResult._max.price) : 1000,
  };
}

export async function removeProductImage(productId: string, imageUrl: string) {
  try {
    // 1. Buscar produto atual
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new Error("Produto não encontrado");

    // 2. Remover imagem do array
    const updatedImages = product.images.filter((img) => img !== imageUrl);

    // 3. Atualizar produto
    await prisma.product.update({
      where: { id: productId },
      data: {
        images: updatedImages,
      },
    });

    // 4. Deletar do UploadThing
    const fileKey = imageUrl.split("/").pop(); // ou use regex se o formato da URL for diferente
    await utapi.deleteFiles(fileKey as string);

    return { success: true, message: "Imagem removida com sucesso" };
  } catch (error) {
    console.error("[REMOVE_PRODUCT_IMAGE]", error);
    return { success: false, message: "Erro ao remover imagem" };
  }
}
