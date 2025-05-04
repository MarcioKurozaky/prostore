import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { getCategoriesWithProductCount } from "@/lib/actions/category.actions";

import { MenuIcon } from "lucide-react";
import Link from "next/link";

export default async function CategoryDrawer() {
  const categories = await getCategoriesWithProductCount();

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>
          <div className="space-y-1 mt-4">
            {categories.map((x) => (
              <Button
                variant="ghost"
                className="w-full justify-start"
                key={x.id}
                asChild
              >
                <DrawerClose asChild>
                  <Link href={`/search?category=${x.name}`}>
                    {x.name} ({x.productCount})
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
