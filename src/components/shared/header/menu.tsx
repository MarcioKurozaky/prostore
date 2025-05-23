import React from "react";
import Link from "next/link";

//use Theme
import ModeToggle from "./modeToggle";

//ui
import { Button } from "@/components/ui/button";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";

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

          <UserButton />
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

              <UserButton />
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </>
  );
}
