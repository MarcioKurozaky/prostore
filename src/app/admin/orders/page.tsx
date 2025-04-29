import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guard";
import { auth } from "@/auth";
import { getAllOrders } from "@/lib/actions/order.actions";
import OrderTable from "@/components/shared/order/ordersTable";

export const metadata: Metadata = {
  title: "Admin Orders",
};

interface AdminOrdersPageProps {
  searchParams: Promise<{
    page: string;
  }>;
}

export default async function UserOrdersPage(props: AdminOrdersPageProps) {
  await requireAdmin();

  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;

  const session = await auth();
  if (session?.user.role !== "admin")
    throw new Error("admin permission required");

  const orders = await getAllOrders({
    page,
    limit: 5,
  });

  const converterOrdersJson = JSON.parse(JSON.stringify(orders));

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <OrderTable orders={converterOrdersJson} page={page} />
    </div>
  );
}
