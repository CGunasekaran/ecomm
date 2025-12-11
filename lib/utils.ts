import { Book } from '@/types';

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

export function filterBooksByCategory(books: Book[], category: string): Book[] {
  if (category === 'all') return books;
  return books.filter(
    (book) => book.category.toLowerCase().replace(' ', '-') === category
  );
}

export function filterBooksByPriceRange(
  books: Book[],
  priceRanges: string[],
  allRanges: { label: string; min: number; max: number }[]
): Book[] {
  if (priceRanges.length === 0) return books;
  
  return books.filter((book) => {
    return priceRanges.some((rangeLabel) => {
      const range = allRanges.find((r) => r.label === rangeLabel);
      if (!range) return false;
      return book.price >= range.min && book.price <= range.max;
    });
  });
}

export function filterBooksByRating(books: Book[], minRating: number): Book[] {
  if (minRating === 0) return books;
  return books.filter((book) => book.rating >= minRating);
}

export function sortBooks(books: Book[], sortBy: string): Book[] {
  const sorted = [...books];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}
