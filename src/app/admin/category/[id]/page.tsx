import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCategoryById } from "@/lib/actions/category.actions";
import CategoryForm from "@/components/admin/category/category-form";

export const metadata: Metadata = {
  title: "Update Category",
};

interface UpdateCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdateProductPage(
  props: UpdateCategoryPageProps
) {
  const { id } = await props.params;

  const category = await getCategoryById(id);

  if (!category) return notFound();

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <h1 className="h2-bold">Update Product</h1>
      <CategoryForm
        type="Update"
        category={category}
        categoryId={category.id}
      />
    </div>
  );
}
