import Link from "next/link";

//ui
import { Button } from "@/components/ui/button";

//verify Admin
import { requireAdmin } from "@/lib/auth-guard";

//get all Products
import { getAllProducts } from "@/lib/actions/product.actions";

import ProductTable from "@/components/admin/product/productTable";

interface AdminProductsPageProps {
  searchParams: Promise<{
    page: string;
    query: string;
    category?: string;
  }>;
}

export default async function AdminProductsPage(props: AdminProductsPageProps) {
  await requireAdmin();

  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";
  const category = searchParams.category || "";

  const products = await getAllProducts({
    query: searchText,
    page,
    category,
    limit: 10,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <h1 className="h2-bold">Products</h1>
          {searchText && (
            <div>
              Filtered by <i>&quot;{searchText}&quot;</i>{" "}
              <Link href={`/admin/products`}>
                <Button variant="outline" size="sm">
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button asChild variant="default">
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>
      <ProductTable products={products || []} page={page} />
    </div>
  );
}
