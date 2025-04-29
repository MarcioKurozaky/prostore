"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatId } from "@/lib/utils";
import { Eye } from "lucide-react";
import { useTheme } from "next-themes";
import Pagination from "@/components/shared/pagination";
import { Product } from "@/types";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteProduct } from "@/lib/actions/product.actions";

interface ProductTableProps {
  products: {
    data: Product[];
    totalPages: number;
  };
  page: number;
}

export default function ProductTable({ products, page }: ProductTableProps) {
  const { theme } = useTheme();

  return (
    <div className="overflow-x-auto">
      {/* Scroll horizontal em telas pequenas */}
      <Table className="min-w-full">
        <TableHeader
          className={`${
            theme === "dark"
              ? "bg-gray-600 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <TableRow>
            <TableHead className="py-3 px-4 text-center">ID</TableHead>
            <TableHead className="py-3 px-4 text-center">NAME</TableHead>
            <TableHead className="py-3 px-4 text-center">PRICE</TableHead>
            <TableHead className="py-3 px-4 text-center">CATEGORY</TableHead>
            <TableHead className="py-3 px-4 text-center">STOCK</TableHead>
            <TableHead className="py-3 px-4 text-center">RATING</TableHead>
            <TableHead className="py-3 px-4 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products?.data.map((product) => (
            <TableRow
              key={product.id}
              className={`even:bg-gray-100 dark:even:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200`}
              // Linhas zebradas (even) e hover suave
            >
              <TableCell className="py-3 px-4 text-center">
                {formatId(product.id)}
              </TableCell>

              <TableCell className="py-3 px-4 text-center">
                {product.name}
              </TableCell>

              <TableCell className="py-3 px-4 text-center">
                {formatCurrency(product.price)}
              </TableCell>

              <TableCell className="py-3 px-4 text-center">
                {product.category}
              </TableCell>

              <TableCell className="py-3 px-4 text-center">
                {product.stock}
              </TableCell>

              <TableCell className="py-3 px-4 text-center">
                {product.rating}
              </TableCell>

              <TableCell className="py-3 px-4 text-center space-x-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hover:text-blue-800 transition-all"
                >
                  <Link href={`/admin/products/${product.id}`}>
                    <Eye className="text-blue-600" />
                    <span className="ml-1">Edit</span>
                  </Link>
                </Button>

                <DeleteDialog id={product.id} action={deleteProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {products?.totalPages && products.totalPages > 1 && (
        <Pagination page={page} totalPages={products.totalPages} />
      )}
    </div>
  );
}
