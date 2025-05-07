"use client";

import { useState, useEffect, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";

const AdminSearch = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  //Update initial state with URL Value
  useEffect(() => {
    const currentQuery = searchParams.get("query") || "";
    setQuery(currentQuery);
  }, [searchParams]);

  // Debounce da query
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set("query", query);
      } else {
        params.delete("query");
      }

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 400); // 400ms de debounce

    return () => clearTimeout(delayDebounce);
  }, [query, pathname, router, searchParams]);

  return (
    <div className="flex flex-col gap-1">
      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={
          isPending ? "opacity-50 transition-opacity duration-300" : ""
        }
      />
      {isPending && <p className="text-xs text-gray-500">Searching...</p>}
    </div>
  );
};

export default AdminSearch;
