import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useCartStore, CartItem } from '@/stores/cartStore';
import { Button, Divider } from 'react-native-paper';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { orderService } from '@/services/api';
import { router } from 'expo-router';

export default function CartScreen() {
    const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();

    const handleCheckout = async () => {
        if (items.length === 0) return;

        try {
            const orderData = {
                items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
                shippingAddress: '123 Default St, City, Country', // Mock address
            };

            const response = await orderService.checkout(orderData);
            if (response.success) {
                Alert.alert('Success', 'Order placed successfully (COD)');
                clearCart();
                router.push('/(tabs)/orders' as any);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to place order');
        }
    };

    const renderItem = ({ item }: { item: CartItem }) => (
        <View className="flex-row p-4 bg-white mb-2 mx-4 rounded-lg shadow-sm">
            <Image source={{ uri: item.image }} className="w-20 h-20 rounded" />
            <View className="flex-1 ml-4 justify-between">
                <View className="flex-row justify-between">
                    <Text className="font-bold text-gray-800 flex-1 mr-2" numberOfLines={2}>{item.name}</Text>
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                        <IconSymbol name="trash" size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="text-blue-600 font-bold">$ {item.price}</Text>
                    <View className="flex-row items-center bg-gray-100 rounded-full px-2">
                        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} className="p-2">
                            <IconSymbol name="minus" size={16} color="black" />
                        </TouchableOpacity>
                        <Text className="mx-3 font-bold">{item.quantity}</Text>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} className="p-2">
                            <IconSymbol name="plus" size={16} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="p-4 bg-white border-bottom border-gray-200">
                <Text className="text-2xl font-bold">Your Cart</Text>
            </View>

            {items.length === 0 ? (
                <View className="flex-1 justify-center items-center p-10">
                    <IconSymbol name="cart.fill" size={64} color="#d1d5db" />
                    <Text className="text-gray-500 mt-4 text-center">Your cart is empty. Start shopping!</Text>
                    <Button mode="contained" onPress={() => router.push('/(tabs)/' as any)} className="mt-6 rounded-full">
                        Browse Products
                    </Button>
                </View>
            ) : (
                <>
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        className="pt-4"
                    />
                    <View className="bg-white p-6 shadow-lg rounded-t-3xl">
                        <View className="flex-row justify-between mb-4">
                            <Text className="text-gray-500">Total</Text>
                            <Text className="text-2xl font-bold text-blue-600">$ {getTotal().toFixed(2)}</Text>
                        </View>
                        <Button
                            mode="contained"
                            className="py-1 rounded-full bg-blue-600"
                            onPress={handleCheckout}
                        >
                            Checkout (COD)
                        </Button>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}
