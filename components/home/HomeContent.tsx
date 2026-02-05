import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View, RefreshControl } from 'react-native';
import { productService, Product } from '@/services/api';
import { CategoryList } from './CategoryList';
import { TopSellers } from './TopSellers';
import { DiscountedProducts } from './DiscountedProducts';
import { ThemedText } from '@/components/themed-text';

export const HomeContent = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [topSellers, setTopSellers] = useState<Product[]>([]);
    const [discounts, setDiscounts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const fetchData = async () => {
        try {
            const [catRes, topRes, discRes] = await Promise.all([
                productService.getCategories(),
                productService.getTopSellers(10),
                productService.getDiscountedProducts(20),
            ]);

            if (catRes.success) setCategories(catRes.data || []);
            if (topRes.success) setTopSellers(topRes.data || []);
            if (discRes.success) setDiscounts(discRes.data || []);
        } catch (error) {
            console.error('Error fetching home data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    if (loading && !refreshing) {
        return (
            <View className="flex-1 justify-center items-center py-10">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <TopSellers
                products={topSellers}
                onProductPress={(p) => console.log('Pressed:', p.name)}
            />

            <DiscountedProducts
                products={discounts}
                onProductPress={(p) => console.log('Pressed:', p.name)}
            />

            {/* Spacer for bottom tab bar */}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};
