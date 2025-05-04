//react components
import React from "react";
import Link from "next/link";
import Image from "next/image";

//constants
import { APP_NAME } from "@/lib/constants";

//logo
import logo from "@/assets/images/logo.svg";

//Menu
import Menu from "./menu";

import CategoryDrawer from "./category-drawer";
import Search from "./search";

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex flex-row">
          <div className="flex-start">
            <CategoryDrawer />

            <Link href="/" className="flex-start ml-4">
              <Image
                priority={true}
                src={logo}
                width={48}
                height={48}
                alt={`${APP_NAME} logo`}
              />

              <span className="hidden lg:block font-bold text-2xl ml-3">
                {APP_NAME}
              </span>
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <Search />
        </div>

        <Menu />
      </div>
    </header>
  );
}
