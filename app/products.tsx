import React, { useState, useCallback } from 'react';
import { FlatList, View, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { productService, Product } from '@/services/api';
import { Searchbar } from 'react-native-paper';
import { useCartStore } from '@/stores/cartStore';
import { router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, DEVICE } from '@/constants/theme-colors';
import { ProductGridSkeleton } from '@/components/product/product-card-skeleton';
import { ErrorRetry } from '@/components/ui/error-retry';
import { useSearchHistoryStore } from '@/stores/searchHistoryStore';
import { RecentSearchesList } from '@/components/search/recent-searches-list';
import { NoResultsEmptyState } from '@/components/search/no-results-empty-state';

const CARD_WIDTH = (DEVICE.width - SPACING.screenPadding * 2 - 10) / 2;

export default function ProductListScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const category = typeof params.category === 'string' && params.category.length > 0 ? params.category : undefined;
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const addItem = useCartStore((state) => state.addItem);
  const addSearch = useSearchHistoryStore((state) => state.addSearch);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch, isRefetching } =
    useInfiniteQuery({
      queryKey: ['products', submittedSearch, category ?? ''],
      queryFn: ({ pageParam = 1 }) =>
        productService.getProducts({ search: submittedSearch, category, page: pageParam, limit: 12 }),
      getNextPageParam: (lastPage) =>
        lastPage.pagination.page < lastPage.pagination.totalPages
          ? lastPage.pagination.page + 1
          : undefined,
      initialPageParam: 1,
    });

  const { data: topSellersData } = useQuery({
    queryKey: ['top-sellers'],
    queryFn: () => productService.getTopSellers(),
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.pages.flatMap((page) => page.data) || [];
  const hasSearched = submittedSearch.length > 0;
  const hasCategory = !!category;
  const shouldShowList = hasSearched || hasCategory;
  const noResults = shouldShowList && !isLoading && !isError && products.length === 0;

  const handleSubmitSearch = useCallback(() => {
    const trimmed = search.trim();
    setSubmittedSearch(trimmed);
    if (trimmed) addSearch(trimmed);
  }, [search, addSearch]);

  const handleSelectRecent = useCallback((query: string) => {
    setSearch(query);
    setSubmittedSearch(query);
    addSearch(query);
  }, [addSearch]);

  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${item.id}` as any)}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, $${item.price}`}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="cover" cachePolicy="memory-disk" transition={150} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cardPrice}>${item.price}</Text>
        <View style={styles.cardBottom}>
          <Text style={styles.cardSold}>{item.soldCount} sold</Text>
          <TouchableOpacity
            onPress={() => addItem(item)}
            style={styles.addCartBtn}
            accessibilityLabel={`Add ${item.name} to cart`}
          >
            <IconSymbol name="cart.badge.plus" size={14} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ), [addItem]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Header (extends up behind status bar) */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Go back">
          <IconSymbol name="chevron.left" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Searchbar
          placeholder="Search products..."
          onChangeText={setSearch}
          value={search}
          onSubmitEditing={handleSubmitSearch}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
      </View>

      {/* Category indicator */}
      {hasCategory && (
        <View style={styles.categoryBar}>
          <Text style={styles.categoryBarText} numberOfLines={1}>Category: {category}</Text>
        </View>
      )}

      {/* Show recent searches when bar is empty and no search/category active */}
      {!shouldShowList && !isLoading && (
        <RecentSearchesList onSelect={handleSelectRecent} />
      )}

      {isLoading ? (
        <View style={styles.skeletonGrid}>
          <ProductGridSkeleton count={6} />
        </View>
      ) : isError ? (
        <ErrorRetry onRetry={refetch} />
      ) : noResults ? (
        <NoResultsEmptyState query={submittedSearch || category || ''} suggestions={topSellersData?.data} />
      ) : shouldShowList ? (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 16 }} color={COLORS.primary} /> : null
          }
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: SPACING.screenPadding, paddingBottom: SPACING.sm,
    backgroundColor: COLORS.headerBg,
  },
  backBtn: { padding: 4 },
  searchBar: {
    flex: 1, height: 40, backgroundColor: COLORS.white, borderRadius: 4, elevation: 0,
  },
  searchInput: { fontSize: TYPOGRAPHY.fontSize.sm, minHeight: 0 },
  categoryBar: {
    paddingHorizontal: SPACING.screenPadding, paddingVertical: SPACING.xs,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  categoryBarText: {
    fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  skeletonGrid: {
    flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding, paddingTop: SPACING.sm,
  },
  list: { paddingHorizontal: SPACING.screenPadding, paddingTop: SPACING.sm, paddingBottom: 80 },
  row: { justifyContent: 'space-between' },
  card: {
    width: CARD_WIDTH, backgroundColor: COLORS.white, borderRadius: 4, borderWidth: 1,
    borderColor: COLORS.cardBorder, overflow: 'hidden', marginBottom: 10, ...SHADOWS.sm,
  },
  cardImage: { height: 140, width: '100%', backgroundColor: COLORS.background },
  cardInfo: { padding: 8 },
  cardName: {
    fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: COLORS.text, lineHeight: 18,
  },
  cardPrice: {
    fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.priceWhole, marginTop: 2,
  },
  cardBottom: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6,
  },
  cardSold: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textMuted },
  addCartBtn: {
    width: 30, height: 30, borderRadius: 4, backgroundColor: COLORS.btnYellow,
    borderWidth: 1, borderColor: COLORS.btnYellowBorder,
    justifyContent: 'center', alignItems: 'center',
  },
});
