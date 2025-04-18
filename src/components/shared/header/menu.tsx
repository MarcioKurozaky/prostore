import React from "react";
import Link from "next/link";

//use Theme
import ModeToggle from "./modeToggle";

//ui
import { Button } from "@/components/ui/button";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Menu() {
  return (
    <>
      <div className="flex justify-end gap-3">
        <nav className="md:flex hidden w-full max-w-xs gap-1">
          <ModeToggle />

          <Button asChild variant="ghost">
            <Link href="/cart">
              <ShoppingCart />
              Cart
            </Link>
          </Button>

          <Button asChild>
            <Link href="/sign-in">
              <UserIcon />
              Sign In
            </Link>
          </Button>
        </nav>

        <nav className="md:hidden">
          <Sheet>
            <SheetTrigger className="align-middle">
              <EllipsisVertical />
            </SheetTrigger>

            <SheetContent className="flex flex-col items-start">
              <SheetTitle>Menu</SheetTitle>

              <ModeToggle />

              <Button asChild variant="ghost">
                <Link href="/cart">
                  <ShoppingCart />
                  Cart
                </Link>
              </Button>

              <Button asChild>
                <Link href="/sign-in">
                  <UserIcon />
                  Sign In
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </>
  );
}
