"use client";

import { getFilterUrl } from "@/lib/constants/getFiltered";
import type { Category } from "@/types";
import Link from "next/link";
import React, { useState } from "react";
import { Slider } from "../ui/slider";
import { useRouter } from "next/navigation";

interface SidebarProductDetailsProps {
  q: string;
  category: string;
  price: string;
  rating: string;
  sort: string;
  page: string;
  categories: Category[];
  priceRange: {
    min: number;
    max: number;
  };
}

export default function SidebarProductDetails({
  category,
  q,
  price,
  rating,
  page,
  sort,
  categories,
  priceRange,
}: SidebarProductDetailsProps) {
  const currentParams = { q, category, price, rating, sort, page };
  const router = useRouter();

  const prices = [
    { name: "$1 to $50", value: "1-50" },
    { name: "$51 to $100", value: "51-100" },
    { name: "$101 to $200", value: "101-200" },
    { name: "$201 to $500", value: "201-500" },
    { name: "$501 to $1000", value: "501-1000" },
  ];

  const ratings = [4, 3, 2, 1];

  const initialRange =
    price !== "all" && price.includes("-")
      ? price.split("-").map(Number)
      : [priceRange.min, priceRange.max];

  const [range, setRange] = useState<number[]>(initialRange);

  const handleSliderCommit = (value: number[]) => {
    const url = getFilterUrl(currentParams, {
      p: `${value[0]}-${value[1]}`,
      pg: "1",
    });
    router.push(url);
  };

  return (
    <aside className="rounded-xl p-4 shadow-sm  space-y-8">
      {/* Categories */}
      <section>
        <h3 className="text-lg font-bold mb-2 text-primary">Department</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              className={`block transition hover:underline ${
                (category === "all" || category === "") &&
                "font-semibold text-primary"
              }`}
              href={getFilterUrl(currentParams, { c: "all" })}
            >
              Any
            </Link>
          </li>
          {categories.map((x) => (
            <li key={x.name}>
              <Link
                className={`block transition hover:underline ${
                  category === x.name && "font-semibold text-primary"
                }`}
                href={getFilterUrl(currentParams, { c: x.name })}
              >
                {x.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Price Range Preset */}
      <section>
        <h3 className="text-lg font-bold mb-2 text-primary">Price</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              className={`block transition hover:underline ${
                price === "all" && "font-semibold text-primary"
              }`}
              href={getFilterUrl(currentParams, { p: "all" })}
            >
              Any
            </Link>
          </li>
          {prices.map((p) => (
            <li key={p.value}>
              <Link
                className={`block transition hover:underline ${
                  price === p.value && "font-semibold text-primary"
                }`}
                href={getFilterUrl(currentParams, { p: p.value })}
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Price Slider */}
      <section>
        <h3 className="text-lg font-bold mb-2 text-primary">Price Range</h3>
        <div className="px-1">
          <Slider
            min={priceRange.min}
            max={priceRange.max}
            step={1}
            value={range}
            onValueChange={setRange}
            onValueCommit={handleSliderCommit}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>${range[0]}</span>
            <span>${range[1]}</span>
          </div>
        </div>
      </section>

      {/* Ratings */}
      <section>
        <h3 className="text-lg font-bold mb-2 text-primary">
          Customer Ratings
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              className={`block transition hover:underline ${
                rating === "all" && "font-semibold text-primary"
              }`}
              href={getFilterUrl(currentParams, { r: "all" })}
            >
              Any
            </Link>
          </li>
          {ratings.map((r) => (
            <li key={r}>
              <Link
                className={`flex items-center gap-2 transition hover:underline ${
                  rating === r.toString() && "font-semibold text-primary"
                }`}
                href={getFilterUrl(currentParams, { r: `${r}` })}
              >
                {`${r} stars & up`}
                <span className="text-yellow-500 text-sm">
                  {Array(r).fill("⭐").join("")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
