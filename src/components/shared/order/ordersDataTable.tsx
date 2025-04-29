"use client";

import { useState } from "react";
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
  // Estado para armazenar o filtro de pesquisa e o campo selecionado
  const [searchQuery, setSearchQuery] = useState("");
  const [filterColumn, setFilterColumn] = useState("all");

  const { theme } = useTheme(); // Obtendo o tema atual

  // Função para atualizar o filtro de pesquisa
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Função para atualizar a coluna de filtro
  const handleColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterColumn(e.target.value);
  };

  // Função para filtrar os dados com base no campo de pesquisa e coluna selecionada
  const filteredOrders = orders.data.filter((order) => {
    if (filterColumn === "all") {
      // Filtra todas as colunas
      return (
        order.id.toString().toLowerCase().includes(searchQuery) ||
        (order.createdAt
          ? formatDateTime(order.createdAt)
              .dateTime.toLowerCase()
              .includes(searchQuery)
          : false) ||
        order.totalPrice.toString().includes(searchQuery) ||
        (order.isPaid ? "paid" : "not paid").includes(
          searchQuery.toLowerCase()
        ) ||
        (order.isDelivered ? "delivered" : "not delivered").includes(
          searchQuery.toLowerCase()
        )
      );
    } else {
      // Filtra apenas a coluna selecionada
      return order[filterColumn]
        ?.toString()
        .toLowerCase()
        .includes(searchQuery);
    }
  });

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
        {/* Filtros de pesquisa */}
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mb-4">
          <select
            value={filterColumn}
            onChange={handleColumnChange}
            className="p-2 border rounded mb-2 md:mb-0"
          >
            <option value="all">Search All Columns</option>
            <option value="id">Search by ID</option>
            <option value="createdAt">Search by Date</option>
            <option value="totalPrice">Search by Total</option>
            <option value="isPaid">Search by Paid Status</option>
            <option value="isDelivered">Search by Delivery Status</option>
          </select>

          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-3 w-full border rounded"
          />
        </div>

        <Table className="min-w-full">
          <TableHeader
            className={`${
              theme === "dark"
                ? "bg-gray-600 text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            <TableRow>
              <TableHead className="py-3 px-4">ID</TableHead>
              <TableHead className="py-3 px-4">Date</TableHead>
              <TableHead className="py-3 px-4">Total</TableHead>
              <TableHead className="py-3 px-4">Paid</TableHead>
              <TableHead className="py-3 px-4">Delivered</TableHead>
              <TableHead className="py-3 px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredOrders.map((order) => (
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
                      <Eye />
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
