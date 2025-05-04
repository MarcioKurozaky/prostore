import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guard";
import { auth } from "@/auth";
import { getAllOrders } from "@/lib/actions/order.actions";
import OrderTable from "@/components/shared/order/ordersTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Orders",
};

interface AdminOrdersPageProps {
  searchParams: Promise<{
    page: number;
    query: string;
  }>;
}

export default async function UserOrdersPage(props: AdminOrdersPageProps) {
  await requireAdmin();

  const searchParams = await props.searchParams;

  const { page = 1, query: searchText } = searchParams;

  const session = await auth();
  if (session?.user.role !== "admin")
    throw new Error("admin permission required");

  const orders = await getAllOrders({
    page: Number(page),
    query: searchText,
  });

  const converterOrdersJson = JSON.parse(JSON.stringify(orders));

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Orders</h1>
        {searchText && (
          <div>
            Filtered by <i>&quot;{searchText}&quot;</i>{" "}
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
      <OrderTable orders={converterOrdersJson} page={page} />
    </div>
  );
}
