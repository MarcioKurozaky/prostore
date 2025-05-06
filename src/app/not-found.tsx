//next
import Image from "next/image";
import Link from "next/link";
import React from "react";

//ui
import { Button } from "@/components/ui/button";

import logo from "@/assets/images/logo.svg";

//constants
import { APP_NAME } from "@/lib/constants";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-slate-100 to-white text-slate-700">
      <Image
        src={logo}
        width={64}
        height={64}
        alt={`${APP_NAME} logo`}
        priority={true}
        className="mb-6"
      />
      <div className="p-8 bg-white bg-opacity-70 backdrop-blur-md rounded-xl shadow-xl w-1/2 max-w-lg">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Sorry, we could not find the page you are looking for.
        </p>
        <Button
          variant="outline"
          className="w-full py-3 text-lg font-medium bg-transparent text-slate-600 hover:bg-indigo-100 border-slate-600 transition-all duration-200 ease-in-out rounded-md"
        >
          <Link href="/">Back To Home</Link>
        </Button>
      </div>
    </div>
  );
}
