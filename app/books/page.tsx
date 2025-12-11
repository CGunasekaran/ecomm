"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BookCard from "@/components/BookCard";
import FilterSidebar from "@/components/FilterSidebar";
import Pagination from "@/components/Pagination";
import AddToCartSlideout from "@/components/AddToCartSlideout";
import {
  Book,
  Category,
  Filters,
  PriceRange,
  SortOption,
  BookFormat,
} from "@/types";
import {
  filterBooksByCategory,
  filterBooksByPriceRange,
  filterBooksByRating,
  sortBooks,
} from "@/lib/utils";

// Import all book data
import fiction from "@/data/fiction.json";
import nonFiction from "@/data/non-fiction.json";
import science from "@/data/science.json";
import technology from "@/data/technology.json";
import selfHelp from "@/data/self-help.json";

const ITEMS_PER_PAGE = 12;

const categories: Category[] = [
  { name: "Fiction", slug: "fiction" },
  { name: "Non-Fiction", slug: "non-fiction" },
  { name: "Science", slug: "science" },
  { name: "Technology", slug: "technology" },
  { name: "Self-Help", slug: "self-help" },
];

const priceRanges: PriceRange[] = [
  { label: "Under $15", min: 0, max: 15 },
  { label: "$15 - $25", min: 15, max: 25 },
  { label: "$25 - $35", min: 25, max: 35 },
  { label: "Over $35", min: 35, max: 999 },
];

function BooksContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [filters, setFilters] = useState<Filters>({
    category: categoryParam || "all",
    priceRange: [],
    minRating: 0,
  });
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSlideout, setShowSlideout] = useState(false);
  const [slideoutBook, setSlideoutBook] = useState<Book | null>(null);
  const [slideoutFormat, setSlideoutFormat] = useState<BookFormat>(
    "Paperback" as BookFormat
  );
  const [slideoutQuantity, setSlideoutQuantity] = useState(1);

  // Combine all books
  const allBooks: Book[] = [
    ...(fiction as Book[]),
    ...(nonFiction as Book[]),
    ...(science as Book[]),
    ...(technology as Book[]),
    ...(selfHelp as Book[]),
  ];

  // Filter books
  let filteredBooks = filterBooksByCategory(allBooks, filters.category);
  filteredBooks = filterBooksByPriceRange(
    filteredBooks,
    filters.priceRange,
    priceRanges
  );
  filteredBooks = filterBooksByRating(filteredBooks, filters.minRating);

  // Sort books
  filteredBooks = sortBooks(filteredBooks, sortBy);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Update category filter when URL param changes
  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [categoryParam]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const handleAddToCart = (
    book: Book,
    format: BookFormat,
    quantity: number
  ) => {
    setSlideoutBook(book);
    setSlideoutFormat(format);
    setSlideoutQuantity(quantity);
    setShowSlideout(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside>
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            priceRanges={priceRanges}
          />
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {filters.category === "all"
                  ? "All Books"
                  : categories.find((c) => c.slug === filters.category)?.name}
              </h1>
              <p className="text-muted-foreground">
                {filteredBooks.length} books found
              </p>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Title: A-Z</option>
            </select>
          </div>

          {/* Books Grid */}
          {paginatedBooks.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No books found matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add to Cart Slideout */}
      <AddToCartSlideout
        isOpen={showSlideout}
        onClose={() => setShowSlideout(false)}
        book={slideoutBook}
        format={slideoutFormat}
        quantity={slideoutQuantity}
      />
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <BooksContent />
    </Suspense>
  );
}
