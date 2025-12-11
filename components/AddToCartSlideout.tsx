"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  XMarkIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Book, BookFormat } from "@/types";

interface AddToCartSlideoutProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  format: BookFormat;
  quantity: number;
}

export default function AddToCartSlideout({
  isOpen,
  onClose,
  book,
  format,
  quantity,
}: AddToCartSlideoutProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!book) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Slideout Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Added to Cart!
                </h2>
                <p className="text-sm text-muted-foreground">
                  {quantity} item{quantity > 1 ? "s" : ""} added successfully
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close notification"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex-1 p-6">
            <div className="flex gap-4 mb-6">
              <div className="relative w-20 h-28 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized={book.image.startsWith("/api/")}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  by {book.author}
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Format:{" "}
                    <span className="text-foreground font-medium">
                      {format}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quantity:{" "}
                    <span className="text-foreground font-medium">
                      {quantity}
                    </span>
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    ${(book.price * quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/cart"
                onClick={onClose}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                View Cart
              </Link>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 border border-border text-foreground bg-card hover:bg-muted rounded-lg font-medium transition-colors"
              >
                Continue Shopping
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <span>✓</span>
                  <span>Free shipping on orders over $25</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <span>✓</span>
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <span>📦</span>
                  <span>Ships within 1-2 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
