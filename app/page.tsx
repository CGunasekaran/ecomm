"use client";

import Link from "next/link";
import { useState } from "react";
import BookCard from "@/components/BookCard";
import AddToCartSlideout from "@/components/AddToCartSlideout";
import { Book, Category, BookFormat } from "@/types";
import fiction from "@/data/fiction.json";
import technology from "@/data/technology.json";

const categories: Category[] = [
  { name: "Fiction", slug: "fiction", emoji: "📖" },
  { name: "Non-Fiction", slug: "non-fiction", emoji: "📚" },
  { name: "Science", slug: "science", emoji: "🔬" },
  { name: "Technology", slug: "technology", emoji: "💻" },
  { name: "Self-Help", slug: "self-help", emoji: "🌟" },
];

export default function HomePage() {
  const [showSlideout, setShowSlideout] = useState(false);
  const [slideoutBook, setSlideoutBook] = useState<Book | null>(null);
  const [slideoutFormat, setSlideoutFormat] = useState<BookFormat>(
    "Paperback" as BookFormat
  );
  const [slideoutQuantity, setSlideoutQuantity] = useState(1);

  const featuredBooks: Book[] = (fiction as Book[])
    .filter((book) => book.featured)
    .slice(0, 4);
  const newReleases: Book[] = (technology as Book[]).slice(0, 4);

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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-primary to-blue-600 text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to BookStore</h1>
            <p className="text-xl mb-8 opacity-90">
              Discover your next favorite book from our vast collection
            </p>
            <Link
              href="/books"
              className="bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-muted transition-colors inline-block focus:outline-ring"
            >
              Browse All Books
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Featured Books</h2>
          <Link
            href="/books"
            className="text-primary hover:text-primary/80 font-semibold transition-colors focus:outline-ring"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
            Browse by Category
          </h2>
          <div
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
            role="navigation"
            aria-label="Book categories"
          >
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/books?category=${category.slug}`}
                className="card p-6 text-center hover:shadow-lg transition-all hover:scale-105 focus:outline-ring"
                aria-label={`Browse ${category.name} books`}
              >
                <div className="text-4xl mb-2" role="img" aria-hidden="true">
                  {category.emoji}
                </div>
                <h3 className="font-semibold text-card-foreground">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Releases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">New Releases</h2>
          <Link
            href="/books"
            className="text-primary hover:text-primary/80 font-semibold transition-colors focus:outline-ring"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newReleases.map((book) => (
            <BookCard key={book.id} book={book} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

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
