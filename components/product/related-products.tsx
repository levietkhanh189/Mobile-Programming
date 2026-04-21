import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  discountPercentage?: number;
}

interface Props {
  products: RelatedProduct[];
}

export default function RelatedProducts({ products }: Props) {
  const router = useRouter();
  if (!products.length) return null;

  return (
    <View className="mt-6 mb-4">
      <Text className="text-white text-lg font-bold mx-4 mb-3">Sản phẩm tương tự</Text>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/product/${item.id}` as any)}
            className="bg-white/10 rounded-xl overflow-hidden w-32"
          >
            <Image source={{ uri: item.image }} className="w-32 h-32" resizeMode="cover" />
            <View className="p-2">
              <Text className="text-white text-xs font-medium" numberOfLines={2}>{item.name}</Text>
              <Text className="text-amber-400 text-xs font-bold mt-1">
                {item.price.toLocaleString('vi-VN')}đ
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
