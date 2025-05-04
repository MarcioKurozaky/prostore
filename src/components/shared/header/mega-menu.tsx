"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Smartphone,
  Shirt,
  Book,
  Dumbbell,
  Drill,
  Sofa,
  Gamepad,
  Leaf,
} from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export type Category = {
  name: string;
  slug: string;
  icon: React.ReactNode;
  subcategories: {
    name: string;
    slug: string;
  }[];
};

export const categories: Category[] = [
  {
    name: "Electronics",
    slug: "electronics",
    icon: <Smartphone size={18} />,
    subcategories: [
      { name: "Phones", slug: "phones" },
      { name: "Laptops", slug: "laptops" },
      { name: "Cameras", slug: "cameras" },
    ],
  },
  {
    name: "Clothing",
    slug: "clothing",
    icon: <Shirt size={18} />,
    subcategories: [
      { name: "Men", slug: "men" },
      { name: "Women", slug: "women" },
      { name: "Kids", slug: "kids" },
    ],
  },
  {
    name: "Books",
    slug: "books",
    icon: <Book size={18} />,
    subcategories: [
      { name: "Fiction", slug: "fiction" },
      { name: "Non-Fiction", slug: "non-fiction" },
      { name: "Children", slug: "children" },
    ],
  },
  {
    name: "Fitness",
    slug: "fitness",
    icon: <Dumbbell size={18} />,
    subcategories: [
      { name: "Gym Equipment", slug: "gym-equipment" },
      { name: "Supplements", slug: "supplements" },
      { name: "Clothing", slug: "fitness-clothing" },
    ],
  },
  {
    name: "Tools",
    slug: "tools",
    icon: <Drill size={18} />,
    subcategories: [
      { name: "Power Tools", slug: "power-tools" },
      { name: "Hand Tools", slug: "hand-tools" },
      { name: "Accessories", slug: "accessories" },
    ],
  },
  {
    name: "Furniture",
    slug: "furniture",
    icon: <Sofa size={18} />,
    subcategories: [
      { name: "Living Room", slug: "living-room" },
      { name: "Bedroom", slug: "bedroom" },
      { name: "Office", slug: "office" },
    ],
  },
  {
    name: "Gaming",
    slug: "gaming",
    icon: <Gamepad size={18} />,
    subcategories: [
      { name: "Consoles", slug: "consoles" },
      { name: "Games", slug: "games" },
      { name: "Accessories", slug: "gaming-accessories" },
    ],
  },
  {
    name: "Garden",
    slug: "garden",
    icon: <Leaf size={18} />,
    subcategories: [
      { name: "Plants", slug: "plants" },
      { name: "Tools", slug: "garden-tools" },
      { name: "Furniture", slug: "garden-furniture" },
    ],
  },
];

export default function MegaMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const openMenu = () => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    setIsVisible(true);
  };

  const closeMenu = () => {
    timeoutId.current = setTimeout(() => {
      setIsVisible(false);
      setActiveCategory(null);
    }, 150);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsVisible(false);
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative">
      {/* Desktop */}
      <div className="hidden md:block" ref={menuRef}>
        <div onMouseEnter={openMenu} onMouseLeave={closeMenu}>
          <button className="px-5 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition">
            All
          </button>

          {isVisible && (
            <div className="absolute z-30 mt-2 flex bg-white border rounded-xl shadow-xl">
              {/* Left: Categories */}
              <div className="w-56 border-r">
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onMouseEnter={() => setActiveCategory(category)}
                    className="w-full px-4 py-2 flex items-center gap-3 text-left text-gray-800 hover:bg-gray-100 transition"
                  >
                    {category.icon}
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Right: Subcategories */}
              {activeCategory && (
                <div className="p-4 w-64">
                  <h4 className="font-bold mb-3 flex items-center gap-2 text-gray-900">
                    {activeCategory.icon}
                    {activeCategory.name}
                  </h4>
                  <ul className="space-y-2">
                    {activeCategory.subcategories.map((sub) => (
                      <li key={sub.slug}>
                        <Link
                          href={`/category/${activeCategory.slug}/${sub.slug}`}
                          className="block text-sm text-gray-600 hover:text-gray-800 hover:underline transition"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="text-sm font-bold text-gray-800">
            All Categories
          </SheetTrigger>
          <SheetContent side="left" className="p-4 w-72">
            <SheetHeader>
              <SheetTitle className="sr-only">Categories</SheetTitle>
            </SheetHeader>
            {categories.map((category) => (
              <div key={category.slug} className="mb-5">
                <h4 className="text-base font-semibold flex items-center gap-2 text-gray-800">
                  {category.icon}
                  {category.name}
                </h4>
                <ul className="ml-4 mt-2 space-y-1">
                  {category.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/category/${category.slug}/${sub.slug}`}
                        className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
