import React from 'react';
import { ActivityIndicator, ScrollView, View, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { CategoryList } from './CategoryList';
import { TopSellers } from './TopSellers';
import { DiscountedProducts } from './DiscountedProducts';
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

    const onRefresh = () => {
        refetchCats();
        refetchTop();
        refetchDisc();
    };

    const isLoading = catLoading || topLoading || discLoading;

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center py-10">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    const navigateToList = (category?: string) => {
        router.push({
            pathname: '/products' as any,
            params: { category },
        });
    };

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        >
            <CategoryList
                categories={categoriesData?.data || []}
                selectedCategory="All"
                onSelectCategory={(cat) => navigateToList(cat)}
            />

            <TopSellers
                products={topSellersData?.data || []}
                onProductPress={(p) => navigateToList(p.category)}
            />

            <DiscountedProducts
                products={discountData?.data || []}
                onProductPress={(p) => navigateToList(p.category)}
            />

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};
