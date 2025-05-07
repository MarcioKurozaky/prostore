import { Metadata } from "next";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyOrders } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Pagination from "@/components/shared/pagination";

export const metadata: Metadata = {
  title: "My Orders",
};

interface UserOrdersPageProps {
  searchParams: Promise<{
    page: string;
  }>;
}

export default async function UserOrdersPage(props: UserOrdersPageProps) {
  const searchParams = await props.searchParams;

  const { page = 1 } = searchParams;

  const orders = await getMyOrders({
    page: Number(page) || 1,
  });

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <Table className="min-w-full bg-white">
          <TableHeader className="bg-gray-100 text-gray-700">
            <TableRow>
              <TableHead className="py-3 px-4 text-left">ID</TableHead>
              <TableHead className="py-3 px-4 text-left">Date</TableHead>
              <TableHead className="py-3 px-4 text-left">Total</TableHead>
              <TableHead className="py-3 px-4 text-left">Paid</TableHead>
              <TableHead className="py-3 px-4 text-left">Delivered</TableHead>
              <TableHead className="py-3 px-4 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.data.map((order) => (
              <TableRow
                key={order.id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <TableCell className="py-3 px-4">
                  {formatId(order.id)}
                </TableCell>

                <TableCell className="py-3 px-4">
                  {order.createdAt
                    ? formatDateTime(order.createdAt).dateTime
                    : "—"}
                </TableCell>

                <TableCell className="py-3 px-4">
                  {formatCurrency(order.totalPrice)}
                </TableCell>

                <TableCell className="py-3 px-4">
                  {order.isPaid && order.paidAt ? (
                    <span className="text-green-600">
                      {formatDateTime(order.paidAt).dateTime}
                    </span>
                  ) : (
                    <span className="text-red-500">Not paid</span>
                  )}
                </TableCell>

                <TableCell className="py-3 px-4">
                  {order.isDelivered && order.deliveredAt ? (
                    <span className="text-green-600">
                      {formatDateTime(order.deliveredAt).dateTime}
                    </span>
                  ) : (
                    <span className="text-yellow-600">Not delivered</span>
                  )}
                </TableCell>

                <TableCell className="py-3 px-4">
                  <Link
                    href={`/order/${order.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={orders?.totalPages}
          />
        )}
      </div>
    </div>
  );
}
