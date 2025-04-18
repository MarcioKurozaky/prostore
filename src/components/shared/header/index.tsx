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

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
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

        <Menu />
      </div>
    </header>
  );
}
