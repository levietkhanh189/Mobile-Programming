import React, { useState } from 'react';
import { FlatList, View, ActivityIndicator, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { productService, Product } from '@/services/api';
import { Card, Searchbar } from 'react-native-paper';
import { useCartStore } from '@/stores/cartStore';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ProductListScreen() {
    const [search, setSearch] = useState('');
    const addItem = useCartStore((state) => state.addItem);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching,
    } = useInfiniteQuery({
        queryKey: ['products', search],
        queryFn: ({ pageParam = 1 }) =>
            productService.getProducts({ search, page: pageParam, limit: 12 }),
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.page < lastPage.pagination.totalPages) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });

    const products = data?.pages.flatMap((page) => page.data) || [];

    const renderProduct = ({ item }: { item: Product }) => (
        <Card className="flex-1 m-2 bg-white overflow-hidden" elevation={2}>
            <Card.Cover source={{ uri: item.image }} style={{ height: 150 }} />
            <Card.Content className="p-2">
                <Text className="text-sm font-bold" numberOfLines={1}>{item.name}</Text>
                <Text className="text-blue-600 font-bold">$ {item.price}</Text>
                <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-xs text-gray-500">Sold: {item.soldCount}</Text>
                    <TouchableOpacity
                        onPress={() => addItem(item)}
                        className="bg-blue-600 p-2 rounded-full"
                    >
                        <IconSymbol name="cart.badge.plus" size={16} color="white" />
                    </TouchableOpacity>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="p-4 flex-row items-center gap-2">
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color="black" />
                </TouchableOpacity>
                <Searchbar
                    placeholder="Search products..."
                    onChangeText={setSearch}
                    value={search}
                    className="flex-1 bg-white h-10 text-sm"
                    inputStyle={{ minHeight: 0 }}
                />
            </View>

            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#2563eb" />
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    onEndReached={() => {
                        if (hasNextPage) fetchNextPage();
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() =>
                        isFetchingNextPage ? <ActivityIndicator className="my-4" /> : null
                    }
                    refreshing={isRefetching}
                    onRefresh={refetch}
                    contentContainerStyle={{ paddingHorizontal: 8 }}
                />
            )}
        </SafeAreaView>
    );
}
