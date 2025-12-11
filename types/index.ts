export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  isbn: string;
  pages: number;
  publisher: string;
  publishDate: string;
  inStock: boolean;
  featured?: boolean;
  
  // New fields
  language: string;
  format: BookFormat[];
  dimensions?: BookDimensions;
  weight?: string;
  edition?: string;
  awards?: string[];
  genres?: string[];
  ageRange?: string;
  publicationCountry?: string;
  translator?: string;
  seriesInfo?: SeriesInfo;
  audioLength?: string; // For audiobook format
  narrator?: string; // For audiobook format
}

export type BookFormat = 'Hardcover' | 'Paperback' | 'Kindle' | 'Audiobook' | 'eBook';

export interface BookDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'inches' | 'cm';
}

export interface SeriesInfo {
  name: string;
  bookNumber: number;
  totalBooks: number;
}

export interface CartItem extends Book {
  quantity: number;
  selectedFormat?: BookFormat;
}

export interface Category {
  name: string;
  slug: string;
  emoji?: string;
}

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export interface Filters {
  category: string;
  priceRange: string[];
  minRating: number;
  format?: BookFormat[];
  language?: string[];
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'title';
