"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Category } from "@/types";

const categories: Category[] = [
  { name: "Fiction", slug: "fiction" },
  { name: "Non-Fiction", slug: "non-fiction" },
  { name: "Science", slug: "science" },
  { name: "Technology", slug: "technology" },
  { name: "Self-Help", slug: "self-help" },
];

export default function Navbar() {
  const { getCartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-card/95 backdrop-blur-sm border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 focus:outline-ring"
          >
            <span className="text-2xl font-bold text-primary">
              📚 BookStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div
            className="hidden md:flex items-center space-x-8"
            role="navigation"
            aria-label="Main navigation"
          >
            <Link
              href="/books"
              className="text-card-foreground hover:text-primary font-medium transition-colors focus:outline-ring"
            >
              All Books
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/books?category=${category.slug}`}
                className="text-card-foreground hover:text-primary font-medium transition-colors focus:outline-ring"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Search & Cart */}
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-muted-foreground hover:text-primary transition-colors focus:outline-ring"
              aria-label="Search books"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            <ThemeToggle />

            <Link
              href="/cart"
              className="relative p-2 text-muted-foreground hover:text-primary transition-colors focus:outline-ring"
              aria-label={`Shopping cart with ${getCartCount()} items`}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {getCartCount() > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  aria-hidden="true"
                >
                  {getCartCount()}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors focus:outline-ring"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden py-4 border-t border-border"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <Link
              href="/books"
              className="block py-2 text-card-foreground hover:text-primary font-medium transition-colors focus:outline-ring"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Books
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/books?category=${category.slug}`}
                className="block py-2 text-card-foreground hover:text-primary font-medium transition-colors focus:outline-ring"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
