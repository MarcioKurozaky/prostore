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
import { formatDateTime, formatId } from "@/lib/utils";
import { Eye } from "lucide-react";
import { useTheme } from "next-themes";
import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";
import type { Category } from "@/types";
import { deleteCategory } from "@/lib/actions/category.actions";

import * as Icons from "lucide-react";

interface CategoryTableProps {
  categories: {
    data: Category[];
    totalPages: number;
  };
  page: number;
}

export default function CategoryTable({
  categories,
  page,
}: CategoryTableProps) {
  const { theme } = useTheme();

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm w-full">
      <Table className="min-w-full ">
        <TableHeader>
          <TableRow>
            <TableHead className="py-3 px-4 text-left">ID</TableHead>
            <TableHead className="py-3 px-4 text-left">Name</TableHead>
            <TableHead className="py-3 px-4 text-left">Icon</TableHead>
            <TableHead className="py-3 px-4 text-left">Date</TableHead>
            <TableHead className="py-3 px-4 text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.data.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="py-3 px-4 text-center">
                {formatId(category.id)}
              </TableCell>

              <TableCell className="py-3 px-4">{category.name}</TableCell>

              <TableCell className="py-3 px-4">{category.icon}</TableCell>

              <TableCell className="py-3 px-4">
                {category.createdAt
                  ? formatDateTime(category.createdAt).dateTime
                  : "—"}
              </TableCell>

              <TableCell className="py-3 px-4 space-x-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hover:text-blue-800 transition-all"
                >
                  <Link href={`/admin/category/${category.id}`}>
                    <Eye className="text-blue-600" />
                    <span className="ml-1">Edit</span>
                  </Link>
                </Button>

                <DeleteDialog id={category.id} action={deleteCategory} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {categories.totalPages > 1 && (
        <Pagination page={page} totalPages={categories.totalPages} />
      )}
    </div>
  );
}
