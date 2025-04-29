// components/admin/orders/order-table.tsx
"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { deleteOrder } from "@/lib/actions/order.actions";
import { Order } from "@/types";

import { useTheme } from "next-themes";

interface OrderTableProps {
  orders: {
    data: Order[];
    totalPages: number;
  };
  page: number;
}

export default function OrderTable({ orders, page }: OrderTableProps) {
  const { theme } = useTheme();

  return (
    <>
      <h2
        className={` text-2xl font-bold ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        My Orders
      </h2>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <Table className="min-w-full ">
          <TableHeader
            className={`${
              theme === "dark"
                ? "bg-gray-600 text-white"
                : "bg-gray-100 text-black"
            }`}
          >
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
                className={`hover:${
                  theme === "dark" ? "bg-gray-300" : "bg-gray-200"
                } transition duration-200`}
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

                <TableCell className="py-3 px-4 space-x-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hover:text-blue-800 transition-all"
                  >
                    <Link href={`/order/${order.id}`}>
                      <Eye className="text-blue-600" />
                      <span className="ml-1">Details</span>
                    </Link>
                  </Button>

                  <DeleteDialog id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.totalPages > 1 && (
          <Pagination page={page} totalPages={orders.totalPages} />
        )}
      </div>
    </>
  );
}
