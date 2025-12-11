"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Book } from "@/types";

interface WishlistContextType {
  wishlist: Book[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  getWishlistCount: () => number;
  isHydrated: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load wishlist from localStorage after hydration
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save wishlist to localStorage whenever it changes (but only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isHydrated]);

  const addToWishlist = (book: Book) => {
    setWishlist((prevWishlist) => {
      // Check if book is already in wishlist
      if (prevWishlist.some((item) => item.id === book.id)) {
        return prevWishlist;
      }
      return [...prevWishlist, book];
    });
  };

  const removeFromWishlist = (bookId: string) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== bookId)
    );
  };

  const isInWishlist = (bookId: string) => {
    // Return false during SSR to prevent hydration mismatch
    if (!isHydrated) return false;
    return wishlist.some((item) => item.id === bookId);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount,
        isHydrated,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
