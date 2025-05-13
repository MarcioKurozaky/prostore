import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/user.actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserIcon,
  LogOut,
  LayoutDashboard,
  PackageSearch,
  Layers,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import LogoutButton from "./logoutButton";

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild variant="outline" className="flex gap-2 items-center">
        <Link href="/sign-in">
          <UserIcon className="w-4 h-4" />
          <span>Sign In</span>
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative w-9 h-9 rounded-full bg-muted hover:bg-primary/20 text-primary font-bold uppercase text-sm"
          >
            {firstInitial}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-80 p-2  rounded-2xl shadow-xl "
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-semibold text-primary">
            <div className="flex flex-col">
              <p className="text-sm">{session.user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <Link
              href="/user/orders"
              className="flex items-center gap-2 w-full text-sm p-2 rounded-lg hover:bg-muted"
            >
              <PackageSearch className="w-4 h-4" />
              Orders
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/user/profile"
              className="flex items-center gap-2 w-full text-sm p-2 rounded-lg hover:bg-muted"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
          </DropdownMenuItem>

          {session?.user?.role === "admin" && (
            <>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 w-full text-sm p-2 rounded-lg hover:bg-muted"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/admin/category"
                  className="flex items-center gap-2 w-full text-sm p-2 rounded-lg hover:bg-muted"
                >
                  <Layers className="w-4 h-4" />
                  Category
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/admin/products"
                  className="flex items-center gap-2 w-full text-sm p-2 rounded-lg hover:bg-muted"
                >
                  <PackageSearch className="w-4 h-4" />
                  Products
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <form action={signOutUser} className="w-full">
            <DropdownMenuItem asChild className="mt-2 p-0">
              <LogoutButton />
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
