import React, { useState, useCallback } from 'react';
import { FlatList, View, ActivityIndicator, Text, TouchableOpacity, SafeAreaView, StyleSheet, Image } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { productService, Product } from '@/services/api';
import { Searchbar } from 'react-native-paper';
import { useCartStore } from '@/stores/cartStore';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { GLASS_COLORS, SPACING, TYPOGRAPHY, SHADOWS, DEVICE } from '@/constants/theme-colors';

const CARD_WIDTH = (DEVICE.width - SPACING.screenPadding * 2 - 12) / 2;

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

  const renderProduct = useCallback(({ item, index }: { item: Product; index: number }) => (
    <Animated.View entering={FadeInUp.duration(400).delay(index * 50)}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/product/${item.id}` as any)}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, $${item.price}`}
      >
        <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.cardPrice}>${item.price}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardSold}>{item.soldCount} sold</Text>
            <TouchableOpacity
              onPress={() => addItem(item)}
              style={styles.addBtn}
              accessibilityLabel={`Add ${item.name} to cart`}
            >
              <IconSymbol name="cart.badge.plus" size={16} color={GLASS_COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  ), [addItem]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
        >
          <IconSymbol name="chevron.left" size={22} color={GLASS_COLORS.text} />
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
          <ActivityIndicator size="large" color={GLASS_COLORS.primary} />
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
            isFetchingNextPage
              ? <ActivityIndicator style={styles.footerLoader} color={GLASS_COLORS.primary} />
              : null
          }
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GLASS_COLORS.backgroundDark },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: SPACING.screenPadding, paddingVertical: SPACING.sm,
    backgroundColor: GLASS_COLORS.white, ...SHADOWS.sm,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: GLASS_COLORS.backgroundDark,
    justifyContent: 'center', alignItems: 'center',
  },
  searchBar: {
    flex: 1, height: 44, backgroundColor: GLASS_COLORS.backgroundDark,
    borderRadius: 14, elevation: 0,
  },
  searchInput: { fontSize: TYPOGRAPHY.fontSize.sm, minHeight: 0 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: SPACING.screenPadding, paddingTop: SPACING.md, paddingBottom: 100 },
  row: { justifyContent: 'space-between' },
  card: {
    width: CARD_WIDTH, backgroundColor: GLASS_COLORS.white, borderRadius: 16,
    overflow: 'hidden', marginBottom: 14, borderWidth: 1,
    borderColor: GLASS_COLORS.cardBorder, ...SHADOWS.sm,
  },
  cardImage: { height: 140, width: '100%' },
  cardInfo: { padding: 10 },
  cardName: {
    fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: GLASS_COLORS.text,
  },
  cardPrice: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: GLASS_COLORS.primary, marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8,
  },
  cardSold: {
    fontSize: TYPOGRAPHY.fontSize.xs, color: GLASS_COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  addBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: GLASS_COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  footerLoader: { marginVertical: SPACING.md },
});
