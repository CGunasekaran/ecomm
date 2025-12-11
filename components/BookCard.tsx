"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { StarIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import {
  StarIcon as StarOutline,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { Book, BookFormat } from "@/types";
import { MouseEvent, useState } from "react";

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book, format: BookFormat, quantity: number) => void;
}

export default function BookCard({ book, onAddToCart }: BookCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>(
    book.format[0]
  );

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart(book, selectedFormat);
    onAddToCart(book, selectedFormat, 1);
  };

  const handleWishlistToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => {
      if (index < Math.floor(rating)) {
        return <StarIcon key={index} className="h-4 w-4 text-yellow-500" />;
      }
      return (
        <StarOutline key={index} className="h-4 w-4 text-muted-foreground" />
      );
    });
  };

  return (
    <Link href={`/books/${book.id}`} className="focus:outline-ring">
      <div className="card p-4 h-full flex flex-col group cursor-pointer hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative h-64 mb-4 overflow-hidden rounded-lg bg-muted">
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            unoptimized={book.image.startsWith("/api/")} // For dynamic images
          />
          {book.originalPrice && (
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-bold">
              <span className="sr-only">Discount:</span>
              SAVE{" "}
              {Math.round(
                ((book.originalPrice - book.price) / book.originalPrice) * 100
              )}
              %
            </div>
          )}
          {book.awards && book.awards.length > 0 && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              <span className="sr-only">Award:</span>
              🏆 Award Winner
            </div>
          )}
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 ${
              book.originalPrice ? "right-16" : "right-2"
            } p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-sm transition-all hover:bg-background hover:scale-110 ${
              isInWishlist(book.id)
                ? "text-red-500"
                : "text-muted-foreground hover:text-red-500"
            }`}
            aria-label={
              isInWishlist(book.id) ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <HeartIcon
              className={`h-5 w-5 ${
                isInWishlist(book.id) ? "fill-current" : ""
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <p className="text-xs text-primary font-semibold mb-1">
            {book.category}
          </p>
          <h3 className="font-semibold text-card-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{book.author}</p>

          {/* Rating */}
          <div
            className="flex items-center gap-1 mb-3"
            role="img"
            aria-label={`Rating: ${book.rating} out of 5 stars`}
          >
            {renderStars(book.rating)}
            <span className="text-xs text-muted-foreground ml-1">
              ({book.reviews})
            </span>
          </div>

          {/* Format Selection */}
          {book.format && book.format.length > 1 && (
            <div className="mb-3" onClick={(e) => e.preventDefault()}>
              <label htmlFor={`format-${book.id}`} className="sr-only">
                Select format for {book.title}
              </label>
              <select
                id={`format-${book.id}`}
                value={selectedFormat}
                onChange={(e) =>
                  setSelectedFormat(e.target.value as BookFormat)
                }
                className="input w-full text-xs"
              >
                {book.format.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Language & Pages */}
          <div className="flex gap-2 mb-3 text-xs text-muted-foreground">
            <span>📖 {book.pages} pages</span>
            <span>🌐 {book.language}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-card-foreground">
              ${book.price}
            </span>
            {book.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${book.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full btn-primary flex items-center justify-center gap-2"
          aria-label={`Add ${book.title} to cart`}
        >
          <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
