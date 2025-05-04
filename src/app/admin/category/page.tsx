import React from "react";

import CategoryTable from "@/components/admin/category/categoryTable";
import { getAllCategory } from "@/lib/actions/category.actions";
import CategoryForm from "@/components/admin/category/category-form";

interface AdminCategoryPageProps {
  searchParams: Promise<{
    page: number;
    query: string;
  }>;
}

export default async function AdminCategoryPage(props: AdminCategoryPageProps) {
  const { page = 1, query: searchText } = await props.searchParams;

  const categories = await getAllCategory({
    page: Number(page),
    query: searchText,
  });

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/3  p-4 rounded-xl shadow-sm">
        <h1 className="h2-bold">Create Category</h1>
        <CategoryForm type="Create" />
      </div>

      <div className="w-full md:w-2/3 p-4 rounded-xl shadow-sm">
        <h1 className="h2-bold">Create Category</h1>
        <CategoryTable categories={categories || []} page={page} />
      </div>
    </div>
  );
}
