"use client";

import { useState, useEffect, useRef } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Book } from "@/types";

interface SharePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export default function SharePopover({
  isOpen,
  onClose,
  book,
  triggerRef,
}: SharePopoverProps) {
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose, triggerRef]);

  if (!book || !isOpen) return null;

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
      color: "hover:bg-blue-50 hover:text-blue-600",
      action: () => {
        const subject = encodeURIComponent(`Check out this book: ${bookTitle}`);
        const body = encodeURIComponent(
          `I thought you might be interested in this book:\n\n${bookTitle} by ${book.author}\n\n${bookDescription}\n\nView it here: ${bookUrl}`
        );
        window.open(`mailto:?subject=${subject}&body=${body}`);
        onClose();
      },
    },
    {
      name: "Facebook",
      icon: "📘",
      color: "hover:bg-blue-50 hover:text-blue-600",
      action: () => {
        const url = encodeURIComponent(bookUrl);
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          "_blank"
        );
        onClose();
      },
    },
    {
      name: "X (Twitter)",
      icon: "🐦",
      color: "hover:bg-gray-50 hover:text-gray-800",
      action: () => {
        const text = encodeURIComponent(
          `Check out "${bookTitle}" by ${book.author}`
        );
        const url = encodeURIComponent(bookUrl);
        window.open(
          `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
          "_blank"
        );
        onClose();
      },
    },
    {
      name: "Instagram",
      icon: "📷",
      color: "hover:bg-pink-50 hover:text-pink-600",
      action: () => {
        copyToClipboard();
      },
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bookUrl);
      setCopied(true);
      setTimeout(() => onClose(), 1500);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = bookUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => onClose(), 1500);
    }
  };

  return (
    <div
      ref={popoverRef}
      className={`absolute z-50 w-64 bg-card border border-border rounded-lg shadow-xl transition-all duration-200 ${
        isOpen
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
      style={{
        top: "calc(100% + 8px)",
        right: "0",
      }}
    >
      {/* Arrow */}
      <div className="absolute -top-2 right-4 w-4 h-4 bg-card border-l border-t border-border rotate-45 transform"></div>

      {/* Content */}
      <div className="relative bg-card rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Share &ldquo;{book.title}&rdquo;
          </h3>
        </div>

        {/* Share Options */}
        <div className="p-2">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground rounded-md transition-colors ${option.color}`}
            >
              <span className="text-lg">{option.icon}</span>
              <span className="font-medium">{option.name}</span>
            </button>
          ))}

          {/* Copy Link */}
          <div className="border-t border-border mt-2 pt-2">
            <button
              onClick={copyToClipboard}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                copied
                  ? "bg-green-50 text-green-700"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <span className="text-lg">
                {copied ? <CheckIcon className="h-5 w-5" /> : "📋"}
              </span>
              <span className="font-medium">
                {copied ? "Copied!" : "Copy Link"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
