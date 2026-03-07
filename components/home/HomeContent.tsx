import React, { useCallback } from 'react';
import { ActivityIndicator, ScrollView, View, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { CategoryList } from './CategoryList';
import { TopSellers } from './TopSellers';
import { DiscountedProducts } from './DiscountedProducts';
import { router } from 'expo-router';
import { COLORS } from '@/constants/theme-colors';

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
      <View className="flex-1 justify-center items-center py-10">
        <ActivityIndicator size="large" color={COLORS.primary} />
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
      <CategoryList
        categories={categoriesData?.data || []}
        selectedCategory="All"
        onSelectCategory={navigateToList}
      />
      <TopSellers
        products={topSellersData?.data || []}
        onProductPress={(p) => router.push(`/product/${p.id}` as any)}
      />
      <DiscountedProducts
        products={discountData?.data || []}
        onProductPress={(p) => router.push(`/product/${p.id}` as any)}
      />
    </ScrollView>
  );
};
