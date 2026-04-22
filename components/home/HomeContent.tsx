import React, { useCallback } from 'react';
import { ScrollView, View, RefreshControl, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { COLORS, SPACING } from '@/constants/theme-colors';
import { TopSellers } from './TopSellers';
import { HomeSearchBar } from './home-search-bar';
import { HomeHeroBanner } from './home-hero-banner';
import { HomeCategoryIconGrid } from './home-category-icon-grid';
import { HomeFlashSaleSection } from './home-flash-sale-section';
import { router } from 'expo-router';

export const HomeContent = () => {
  const { data: categoriesData, isLoading: catLoading, refetch: refetchCats } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
  });

  const { data: topSellersData, isLoading: topLoading, refetch: refetchTop } = useQuery({
    queryKey: ['top-sellers'],
    queryFn: () => productService.getTopSellers(10),
  });

  const { data: discountData, isLoading: discLoading, refetch: refetchDisc } = useQuery({
    queryKey: ['discounts'],
    queryFn: () => productService.getDiscountedProducts(20),
  });

  const onRefresh = useCallback(() => {
    refetchCats();
    refetchTop();
    refetchDisc();
  }, [refetchCats, refetchTop, refetchDisc]);

  const isLoading = catLoading || topLoading || discLoading;

  const navigateToList = useCallback((category?: string) => {
    router.push({ pathname: '/products' as any, params: { category } });
  }, []);

  if (isLoading) {
    return (
      <View style={homeSkelStyles.container}>
        {/* Hero banner skeleton */}
        <Skeleton width="100%" height={160} borderRadius={0} />
        {/* Search bar skeleton */}
        <View style={homeSkelStyles.row}>
          <Skeleton width="100%" height={44} borderRadius={8} />
        </View>
        {/* Category row skeleton */}
        <View style={homeSkelStyles.catRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} width={56} height={72} borderRadius={8} />
          ))}
        </View>
        {/* Product grid skeleton */}
        <View style={homeSkelStyles.grid}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width="48%" height={160} borderRadius={4} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      <HomeSearchBar />
      <HomeHeroBanner />
      <HomeCategoryIconGrid
        categories={categoriesData?.data || []}
        onSelectCategory={navigateToList}
      />
      <HomeFlashSaleSection
        products={discountData?.data || []}
        onProductPress={(p) => router.push(`/product/${p.id}` as any)}
      />
      <TopSellers
        products={topSellersData?.data || []}
        onProductPress={(p) => router.push(`/product/${p.id}` as any)}
      />
    </ScrollView>
  );
};

const homeSkelStyles = StyleSheet.create({
  container: { flex: 1, paddingBottom: SPACING.xl },
  row: { paddingHorizontal: SPACING.screenPadding, marginTop: SPACING.sm },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding,
    marginTop: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding,
    marginTop: SPACING.md,
    gap: 8,
  },
});
