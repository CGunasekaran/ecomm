"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Book } from "@/types";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

export default function ShareModal({ isOpen, onClose, book }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!book) return null;

  const bookUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/books/${book.id}`;
  const bookTitle = book.title;
  const bookDescription = `Check out "${book.title}" by ${
    book.author
  } - ${book.description.substring(0, 100)}...`;

  const shareOptions = [
    {
      name: "Email",
      icon: "📧",
      action: () => {
        const subject = encodeURIComponent(`Check out this book: ${bookTitle}`);
        const body = encodeURIComponent(
          `I thought you might be interested in this book:\n\n${bookTitle} by ${book.author}\n\n${bookDescription}\n\nView it here: ${bookUrl}`
        );
        window.open(`mailto:?subject=${subject}&body=${body}`);
      },
    },
    {
      name: "Facebook",
      icon: "📘",
      action: () => {
        const url = encodeURIComponent(bookUrl);
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          "_blank"
        );
      },
    },
    {
      name: "X (Twitter)",
      icon: "🐦",
      action: () => {
        const text = encodeURIComponent(
          `Check out "${bookTitle}" by ${book.author}`
        );
        const url = encodeURIComponent(bookUrl);
        window.open(
          `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
          "_blank"
        );
      },
    },
    {
      name: "Instagram",
      icon: "📷",
      action: () => {
        // Instagram doesn't support direct sharing via URL, so we'll copy to clipboard
        copyToClipboard();
      },
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bookUrl);
      setCopied(true);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = bookUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">
              Share Book
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              aria-label="Close share modal"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Book Info */}
          <div className="p-6 border-b border-border">
            <div className="flex gap-3">
              <div className="relative w-12 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                  unoptimized={book.image.startsWith("/api/")}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  by {book.author}
                </p>
                <p className="text-lg font-semibold text-primary mt-1">
                  ${book.price}
                </p>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted transition-all hover:border-primary group"
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium text-foreground group-hover:text-primary">
                    {option.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Copy Link */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                Or copy link:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bookUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    copied
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    "Copy"
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600">
                  Link copied to clipboard!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
