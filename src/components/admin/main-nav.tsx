"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { title: "Dashboard", href: "/admin/dashboard" },
  { title: "Products", href: "/admin/products" },
  { title: "Orders", href: "/admin/orders" },
  { title: "Users", href: "/admin/users" },
  { title: "Category", href: "/admin/category" },
];

const AdminMainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center gap-3 lg:gap-5", className)}
      {...props}
    >
      {links.map((item) => {
        const isActive = pathname.includes(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200",
              isActive
                ? "border border-primary text-primary shadow-sm bg-transparent rounded-xl"
                : "text-muted-foreground hover:text-primary hover:bg-muted rounded-xl"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminMainNav;
