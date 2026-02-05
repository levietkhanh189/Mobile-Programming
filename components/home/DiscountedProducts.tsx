import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { Product } from '@/services/api';

interface DiscountedProductsProps {
    products: Product[];
    onProductPress: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const columnWidth = (width - 48) / 2;

export const DiscountedProducts: React.FC<DiscountedProductsProps> = ({ products, onProductPress }) => {
    return (
        <View className="my-4 px-4">
            <Text className="text-xl font-bold mb-3 text-gray-800">Special Offers</Text>
            <View className="flex-row flex-wrap justify-between">
                {products.map((product) => (
                    <TouchableOpacity
                        key={product.id}
                        onPress={() => onProductPress(product)}
                        style={{ width: columnWidth, marginBottom: 16 }}
                    >
                        <Card className="overflow-hidden bg-white shadow-sm border border-gray-100">
                            <View className="relative">
                                <Image
                                    source={{ uri: product.image }}
                                    style={{ height: 150, width: '100%' }}
                                    resizeMode="cover"
                                />
                                <View className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded">
                                    <Text className="text-white text-xs font-bold">-{product.discountPercentage}%</Text>
                                </View>
                            </View>
                            <Card.Content className="p-2">
                                <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>
                                    {product.name}
                                </Text>
                                <View className="flex-row items-center mt-1 gap-2">
                                    <Text className="text-blue-600 font-bold">$ {(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}</Text>
                                    <Text className="text-xs text-gray-400 line-through">${product.price}</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};
