import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProductById } from "@/lib/actions/product.actions";
import ProductForm from "@/components/admin/product/product-form";

import { getAllCategory } from "@/lib/actions/category.actions";

export const metadata: Metadata = {
  title: "Update product",
};

interface UpdateProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdateProductPage(props: UpdateProductPageProps) {
  const { id } = await props.params;

  const product = await getProductById(id);

  const categories = await getAllCategory({ page: 1, query: "all" });

  if (!product) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Product</h1>
      <ProductForm
        type="Update"
        product={product}
        productId={product.id}
        categories={categories.data}
      />
    </div>
  );
}
