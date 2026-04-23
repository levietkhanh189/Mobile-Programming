import { Product } from './api';

export interface ProductRankingInput extends Product {
  rating?: number;
  reviewCount?: number;
}

export interface RankedProduct extends ProductRankingInput {
  rankingScore: number;
}


const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};
const normalizePrice = (price: number): number => {
  if (price <= 0) return 0;
  if (price >= 5000000) return 1;
  return price / 5000000;
};


export const computeProductRankingScore = (product: ProductRankingInput): number => {
  const soldWeight = 0.35;
  const discountWeight = 0.25;
  const ratingWeight = 0.25;
  const priceWeight = 0.15;

  const soldSignal = clamp(product.soldCount / 1000, 0, 1);
  const discountSignal = clamp(product.discountPercentage / 100, 0, 1);
  const ratingSignal = clamp((product.rating ?? 0) / 5, 0, 1);
  const priceSignal = 1 - normalizePrice(product.price);

  const score =
    soldSignal * soldWeight +
    discountSignal * discountWeight +
    ratingSignal * ratingWeight +
    priceSignal * priceWeight;

  return Number(score.toFixed(4));
};

export const rankProducts = (products: ProductRankingInput[]): RankedProduct[] => {
  return [...products]
    .map((product) => ({
      ...product,
      rankingScore: computeProductRankingScore(product),
    }))
    .sort((a, b) => b.rankingScore - a.rankingScore);
};

export const pickTopRankedProducts = (
  products: ProductRankingInput[],
  limit: number = 10
): RankedProduct[] => {
  if (limit <= 0) return [];
  return rankProducts(products).slice(0, limit);
};
