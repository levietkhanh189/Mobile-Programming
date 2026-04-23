import { useMemo } from 'react';
import type { Product } from '../services/api';

export type ProductSortKey =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'best_selling'
  | 'highest_discount';

export interface UseProductSortOptions {
  keyword?: string;
  category?: string;
  sortBy?: ProductSortKey;
}

const normalizeText = (value: string): string => value.trim().toLowerCase();

export function useProductSort(
  products: Product[] | undefined,
  options: UseProductSortOptions = {}
) {
  const { keyword = '', category = '', sortBy = 'newest' } = options;

  return useMemo(() => {
    const source = products ?? [];
    const normalizedKeyword = normalizeText(keyword);
    const normalizedCategory = normalizeText(category);

    const filtered = source.filter((product) => {
      const matchedKeyword =
        normalizedKeyword.length === 0 ||
        normalizeText(product.name).includes(normalizedKeyword) ||
        normalizeText(product.description).includes(normalizedKeyword);

      const matchedCategory =
        normalizedCategory.length === 0 ||
        normalizeText(product.category) === normalizedCategory;

      return matchedKeyword && matchedCategory;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'best_selling':
          return b.soldCount - a.soldCount;
        case 'highest_discount':
          return b.discountPercentage - a.discountPercentage;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [products, keyword, category, sortBy]);
}
