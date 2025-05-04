"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { convertToPlainObject, formatError } from "../utils";
import { prisma } from "@/db/prisma";
import { insertCategorySchema, updateCategorySchema } from "../validators";
import type { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "../constants";

// Create Product
export async function createCategory(
  data: z.infer<typeof insertCategorySchema>
) {
  try {
    // Validate and create product
    const category = insertCategorySchema.parse(data);
    await prisma.category.create({ data: category });

    revalidatePath("/admin/category");

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update Category
export async function updateCategory(
  data: z.infer<typeof updateCategorySchema>
) {
  try {
    // Validate and find Category
    const category = updateCategorySchema.parse(data);
    const categoryExists = await prisma.category.findFirst({
      where: { id: category.id },
    });

    if (!categoryExists) throw new Error("Category not found");

    // Update product
    await prisma.category.update({
      where: { id: category.id },
      data: category,
    });

    console.log("====================================");
    console.log(category);
    console.log("====================================");
    revalidatePath("/admin/category");

    return {
      success: true,
      message: "Category updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Delete Category
export async function deleteCategory(id: string) {
  try {
    const categoryExists = await prisma.category.findFirst({
      where: { id },
    });

    if (!categoryExists) throw new Error("Category not found");

    await prisma.category.delete({ where: { id } });

    revalidatePath("/admin/category");

    return {
      success: true,
      message: "Category deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get Category by ID
export async function getCategoryById(categoryId: string) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId },
  });

  if (!category) throw new Error("Category not found");

  return convertToPlainObject(category);
}

// Get all the category
export async function getAllCategory({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.CategoryWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.category.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.category.count();

  const convData = JSON.parse(JSON.stringify(data));

  return {
    data: convData,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Get product categories
export async function getAllProductCategories() {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });

  return data;
}

export async function getCategoriesWithProductCount() {
  const categories = await prisma.category.findMany();

  const productCounts = await prisma.product.groupBy({
    by: ["category"],
    _count: { category: true },
  });

  // Transform in object
  const countMap = productCounts.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = item._count.category;
    return acc;
  }, {});

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    productCount: countMap[category.name] || 0,
  }));
}
