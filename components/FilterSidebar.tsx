"use client";

import { Category, Filters, PriceRange } from "@/types";
import { ChangeEvent } from "react";

interface FilterSidebarProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  categories: Category[];
  priceRanges: PriceRange[];
}

export default function FilterSidebar({
  filters,
  setFilters,
  categories,
  priceRanges,
}: FilterSidebarProps) {
  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, category: e.target.value });
  };

  const handlePriceRangeChange = (
    e: ChangeEvent<HTMLInputElement>,
    rangeLabel: string
  ) => {
    if (e.target.checked) {
      setFilters({
        ...filters,
        priceRange: [...filters.priceRange, rangeLabel],
      });
    } else {
      setFilters({
        ...filters,
        priceRange: filters.priceRange.filter((p) => p !== rangeLabel),
      });
    }
  };

  const handleRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, minRating: Number(e.target.value) });
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      priceRange: [],
      minRating: 0,
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-sm p-6 sticky top-20 border border-border">
      <h3 className="text-lg font-bold mb-4">Filters</h3>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="all"
              checked={filters.category === "all"}
              onChange={handleCategoryChange}
              className="mr-2"
            />
            All Categories
          </label>
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={cat.slug}
                checked={filters.category === cat.slug}
                onChange={handleCategoryChange}
                className="mr-2"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.priceRange.includes(range.label)}
                onChange={(e) => handlePriceRangeChange(e, range.label)}
                className="mr-2"
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.minRating === rating}
                onChange={handleRatingChange}
                className="mr-2"
              />
              {rating}+ Stars
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button onClick={clearFilters} className="w-full btn-secondary">
        Clear Filters
      </button>
    </div>
  );
}
