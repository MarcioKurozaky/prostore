import { Metadata } from "next";

import { requireAdmin } from "@/lib/auth-guard";

import { getAllUsers } from "@/lib/actions/user.actions";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserTable from "@/components/admin/user/userTable";

export const metadata: Metadata = {
  title: "Admin Users",
};

interface AdminUserPageProps {
  searchParams: Promise<{
    page: number;
    query: string;
  }>;
}

export default async function AdminUserPage(props: AdminUserPageProps) {
  await requireAdmin();

  const { page = 1, query: searchText } = await props.searchParams;

  const users = await getAllUsers({ page: Number(page), query: searchText });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Users</h1>
        <Button asChild variant="default">
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>
      <UserTable users={users || []} page={page} />
    </div>
  );
}
