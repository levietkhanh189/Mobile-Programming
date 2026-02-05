import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Product } from '@/services/api';

interface TopSellersProps {
    products: Product[];
    onProductPress: (product: Product) => void;
}

export const TopSellers: React.FC<TopSellersProps> = ({ products, onProductPress }) => {
    return (
        <View className="my-4">
            <Text className="text-xl font-bold px-4 mb-3 text-gray-800">Top Sellers</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            >
                {products.map((product) => (
                    <TouchableOpacity
                        key={product.id}
                        onPress={() => onProductPress(product)}
                        className="mr-4 w-48"
                    >
                        <Card className="overflow-hidden bg-white shadow-sm">
                            <Image
                                source={{ uri: product.image }}
                                style={{ height: 120, width: '100%' }}
                                resizeMode="cover"
                            />
                            <Card.Content className="p-2">
                                <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>
                                    {product.name}
                                </Text>
                                <Text className="text-blue-600 font-bold mt-1">${product.price}</Text>
                                <Text className="text-xs text-gray-500 mt-1">Sold: {product.soldCount}</Text>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};
