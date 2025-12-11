"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { StarIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import {
  StarIcon as StarOutline,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { Book, BookFormat } from "@/types";
import AddToCartSlideout from "@/components/AddToCartSlideout";
import SharePopover from "@/components/SharePopover";
// Import all book data
import fiction from "@/data/fiction.json";
import nonFiction from "@/data/non-fiction.json";
import science from "@/data/science.json";
import technology from "@/data/technology.json";
import selfHelp from "@/data/self-help.json";

export default function BookDetailsPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>(
    "Paperback" as BookFormat
  );
  const [showSlideout, setShowSlideout] = useState(false);
  const [showSharePopover, setShowSharePopover] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement>(null);

  // Find the book
  const allBooks: Book[] = [
    ...(fiction as Book[]),
    ...(nonFiction as Book[]),
    ...(science as Book[]),
    ...(technology as Book[]),
    ...(selfHelp as Book[]),
  ];
  const book = allBooks.find((b) => b.id === params.id);

  // Set selected format after book is found
  if (
    book &&
    selectedFormat === "Paperback" &&
    book.format.length > 0 &&
    !book.format.includes("Paperback")
  ) {
    setSelectedFormat(book.format[0]);
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold">Book not found</h1>
        <Link
          href="/books"
          className="text-primary-600 hover:underline mt-4 inline-block"
        >
          Back to Books
        </Link>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => {
      if (index < Math.floor(rating)) {
        return <StarIcon key={index} className="h-5 w-5 text-yellow-400" />;
      }
      return (
        <StarOutline key={index} className="h-5 w-5 text-muted-foreground" />
      );
    });
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(book, selectedFormat);
    }
    setShowSlideout(true);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  const handleShare = () => {
    setShowSharePopover(!showSharePopover);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Book Image */}
        <div className="relative h-96 lg:h-[500px] bg-muted rounded-lg overflow-hidden">
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            unoptimized={book.image.startsWith("/api/")}
          />
          {book.originalPrice && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg font-bold">
              SAVE{" "}
              {Math.round(
                ((book.originalPrice - book.price) / book.originalPrice) * 100
              )}
              %
            </div>
          )}
        </div>

        {/* Book Details */}
        <div>
          <div className="mb-2">
            <span className="text-sm text-primary-600 font-semibold">
              {book.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {book.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">{renderStars(book.rating)}</div>
            <span className="text-muted-foreground">
              ({book.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-foreground">
              ${book.price}
            </span>
            {book.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">
                ${book.originalPrice}
              </span>
            )}
          </div>

          {/* Format Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Available Formats</h3>
            <div className="flex flex-wrap gap-2">
              {book.format.map((format) => (
                <button
                  key={format}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    selectedFormat === format
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-card-foreground border-border hover:border-primary"
                  }`}
                  onClick={() => setSelectedFormat(format)}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full btn-primary flex items-center justify-center gap-2 mb-6"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Add to Cart
          </button>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8 relative">
            <button
              onClick={handleWishlistToggle}
              className={`flex items-center gap-2 transition-colors ${
                isInWishlist(book.id)
                  ? "text-red-500 hover:text-red-600"
                  : "text-muted-foreground hover:text-red-500"
              }`}
              aria-label={
                isInWishlist(book.id)
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              <HeartIcon
                className={`h-5 w-5 ${
                  isInWishlist(book.id) ? "fill-current" : ""
                }`}
              />
              {isInWishlist(book.id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>
            <button
              ref={shareButtonRef}
              onClick={handleShare}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Share this book"
            >
              <ShareIcon className="h-5 w-5" />
              Share
            </button>

            {/* Share Popover */}
            <SharePopover
              isOpen={showSharePopover}
              onClose={() => setShowSharePopover(false)}
              book={book}
              triggerRef={shareButtonRef}
            />
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3 text-foreground">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {book.description}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-muted rounded-lg p-6">
          <h3 className="font-semibold mb-3 text-foreground">Book Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">ISBN:</span>
              <span className="ml-2 font-medium text-foreground">
                {book.isbn}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Pages:</span>
              <span className="ml-2 font-medium text-foreground">
                {book.pages}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Publisher:</span>
              <span className="ml-2 font-medium text-foreground">
                {book.publisher}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Published:</span>
              <span className="ml-2 font-medium text-foreground">
                {book.publishDate}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Language:</span>
              <span className="ml-2 font-medium text-foreground">
                {book.language}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Edition:</span>
              <span className="ml-2 font-medium text-foreground">
                {book.edition || "Standard"}
              </span>
            </div>
            {book.dimensions && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Dimensions:</span>
                <span className="ml-2 font-medium text-foreground">
                  {book.dimensions.length} x {book.dimensions.width} x{" "}
                  {book.dimensions.height} {book.dimensions.unit}
                </span>
              </div>
            )}
            {book.weight && (
              <div>
                <span className="text-muted-foreground">Weight:</span>
                <span className="ml-2 font-medium text-foreground">
                  {book.weight}
                </span>
              </div>
            )}
            {book.audioLength && (
              <div>
                <span className="text-muted-foreground">Audio Length:</span>
                <span className="ml-2 font-medium text-foreground">
                  {book.audioLength}
                </span>
              </div>
            )}
          </div>

          {/* Genres */}
          {book.genres && book.genres.length > 0 && (
            <div className="mt-4">
              <span className="text-muted-foreground text-sm">Genres: </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {book.genres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {book.awards && book.awards.length > 0 && (
            <div className="mt-4">
              <span className="text-muted-foreground text-sm flex items-center gap-2">
                🏆 Awards & Recognition
              </span>
              <ul className="mt-2 space-y-1">
                {book.awards.map((award, index) => (
                  <li key={index} className="text-sm text-foreground">
                    • {award}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="bg-muted rounded-lg p-6">
          <h3 className="font-semibold mb-3 text-foreground">
            Shipping & Returns
          </h3>
          <div className="space-y-3 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Free shipping on orders over $25</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>30-day return policy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Ships within 1-2 business days</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📧</span>
              <span>Email delivery for digital formats</span>
            </div>
          </div>

          {book.inStock ? (
            <div className="mt-4 text-green-600 font-medium">✓ In Stock</div>
          ) : (
            <div className="mt-4 text-red-600 font-medium">⚠ Out of Stock</div>
          )}
        </div>
      </div>

      {/* Add to Cart Slideout */}
      <AddToCartSlideout
        isOpen={showSlideout}
        onClose={() => setShowSlideout(false)}
        book={book}
        format={selectedFormat}
        quantity={quantity}
      />
    </div>
  );
}
