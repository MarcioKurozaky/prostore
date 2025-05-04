import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guard";
import ProductForm from "@/components/admin/product/product-form";
import { getAllCategory } from "@/lib/actions/category.actions";

export const metadata: Metadata = {
  title: "Create product",
};

export default async function CreateProductPage() {
  await requireAdmin();

  const categories = await getAllCategory({ page: 1, query: "all" });

  return (
    <>
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        <ProductForm type="Create" categories={categories.data} />
      </div>
    </>
  );
}
