"use client";

import { useEffect, useState } from "react";
import { getCategoryId } from "@/utils/product.utils";

type CategoriesNavProps = {
  categories: string[];
};

export default function CategoriesNav({ categories }: CategoriesNavProps) {
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    setActiveCategory(categories[0] || "");
  }, [categories]);

  useEffect(() => {
    const handleScroll = () => {
      let currentCategory = categories[0] || "";

      for (const category of categories) {
        const section = document.getElementById(getCategoryId(category));
        if (!section) continue;

        const rect = section.getBoundingClientRect();

        if (rect.top <= 180) {
          currentCategory = category;
        }
      }

      setActiveCategory(currentCategory);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  return (
    <div className="sticky top-20 z-30 overflow-x-auto rounded-2xl bg-white py-3 shadow-sm">
      <div className="flex min-w-max gap-3 px-1">
        {categories.map((categoryName) => {
          const isActive = activeCategory === categoryName;

          return (
            <a
              key={categoryName}
              href={`#${getCategoryId(categoryName)}`}
              className={`shrink-0 inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {categoryName}
            </a>
          );
        })}
      </div>
    </div>
  );
}