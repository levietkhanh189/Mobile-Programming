import React, { useState, useCallback } from 'react';
import { FlatList, View, ActivityIndicator, Text, TouchableOpacity, SafeAreaView, StyleSheet, Image } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { productService, Product } from '@/services/api';
import { Searchbar } from 'react-native-paper';
import { useCartStore } from '@/stores/cartStore';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, DEVICE } from '@/constants/theme-colors';

const CARD_WIDTH = (DEVICE.width - SPACING.screenPadding * 2 - 10) / 2;

export default function ProductListScreen() {
  const [search, setSearch] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } =
    useInfiniteQuery({
      queryKey: ['products', search],
      queryFn: ({ pageParam = 1 }) =>
        productService.getProducts({ search, page: pageParam, limit: 12 }),
      getNextPageParam: (lastPage) =>
        lastPage.pagination.page < lastPage.pagination.totalPages
          ? lastPage.pagination.page + 1
          : undefined,
      initialPageParam: 1,
    });

  const products = data?.pages.flatMap((page) => page.data) || [];

  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${item.id}` as any)}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, $${item.price}`}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Go back">
          <IconSymbol name="chevron.left" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Searchbar
          placeholder="Search products..."
          onChangeText={setSearch}
          value={search}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
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
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: SPACING.screenPadding, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.headerBg,
  },
  backBtn: { padding: 4 },
  searchBar: {
    flex: 1, height: 40, backgroundColor: COLORS.white, borderRadius: 4, elevation: 0,
  },
  searchInput: { fontSize: TYPOGRAPHY.fontSize.sm, minHeight: 0 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
