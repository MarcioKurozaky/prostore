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
import { formatId } from "@/lib/utils";
import { Eye } from "lucide-react";
import { useTheme } from "next-themes";
import Pagination from "@/components/shared/pagination";

import DeleteDialog from "@/components/shared/delete-dialog";
import type { User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { deleteUser } from "@/lib/actions/user.actions";

interface UserTableProps {
  users: {
    data: User[];
    totalPages: number;
  };
  page: number;
}

export default function UserTable({ users, page }: UserTableProps) {
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
            <TableHead className="py-3 px-4 text-center">EMAIL</TableHead>
            <TableHead className="py-3 px-4 text-center">ROLE</TableHead>
            <TableHead className="py-3 px-4 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.data.map((user) => (
            <TableRow
              key={user.id}
              className={`even:bg-gray-100 dark:even:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200`}
            >
              <TableCell className="py-3 px-4 text-center">
                {formatId(user.id)}
              </TableCell>

              <TableCell className="py-3 px-4 text-center">
                {user.name}
              </TableCell>

              <TableCell className="py-3 px-4 text-center">
                {user.email}
              </TableCell>

              <TableCell className="py-3 px-4 text-center">
                {user.role === "user" ? (
                  <Badge variant="secondary">User</Badge>
                ) : (
                  <Badge variant="destructive">Admin</Badge>
                )}
              </TableCell>

              <TableCell className="py-3 px-4 text-center space-x-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hover:text-blue-800 transition-all"
                >
                  <Link href={`/admin/users/${user.id}`}>
                    <Eye className="text-blue-600" />
                    <span className="ml-1">Edit</span>
                  </Link>
                </Button>

                <DeleteDialog id={user.id} action={deleteUser} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {users?.totalPages && users.totalPages > 1 && (
        <Pagination page={page} totalPages={users.totalPages} />
      )}
    </div>
  );
}
