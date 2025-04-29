"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

export default function Pagination({
  page,
  totalPages,
  urlParamName,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (btnType: "next" | "prev") => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });

    router.push(newUrl);
  };

  return (
    <div className="mt-6 flex items-center justify-center gap-4 text-gray-700">
      <Button
        size="lg"
        variant="outline"
        className="w-28 transition duration-200"
        disabled={Number(page) <= 1}
        onClick={() => handleClick("prev")}
      >
        ⬅ Previous
      </Button>

      <span className="text-lg font-semibold">
        Page {page} of {totalPages}
      </span>

      <Button
        size="lg"
        variant="outline"
        className="w-28 transition duration-200"
        disabled={Number(page) >= totalPages}
        onClick={() => handleClick("next")}
      >
        Next ➡
      </Button>
    </div>
  );
}
