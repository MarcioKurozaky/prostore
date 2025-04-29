"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchInput() {
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);
  return (
    <>
      {searchOpen ? (
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search..."
          className=" md:w-[100px] lg:w-[600px] lg:h-[50px] transition-all duration-300"
          onBlur={() => setSearchOpen(false)}
        />
      ) : (
        <button
          onClick={() => setSearchOpen(true)}
          className="text-gray-600 hover:text-black transition"
        >
          <Search size={22} />
        </button>
      )}
    </>
  );
}
