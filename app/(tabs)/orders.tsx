import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Alert, RefreshControl } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, Order } from '@/services/api';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Card, Divider, Button } from 'react-native-paper';

export default function OrderHistoryScreen() {
    const queryClient = useQueryClient();

    const { data, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['orders'],
        queryFn: orderService.getOrderHistory,
    });

    const cancelMutation = useMutation({
        mutationFn: orderService.cancelOrder,
        onSuccess: (res) => {
            if (res.success) {
                Alert.alert('Success', 'Order cancelled');
                queryClient.invalidateQueries({ queryKey: ['orders'] });
            } else {
                Alert.alert('Error', res.message);
            }
        },
        onError: (error: any) => {
            Alert.alert('Error', error.message || 'Failed to cancel order');
        }
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Confirmed': return 'bg-blue-100 text-blue-700';
            case 'Processing': return 'bg-purple-100 text-purple-700';
            case 'Shipping': return 'bg-indigo-100 text-indigo-700';
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const orders = data?.data || [];

    const renderOrder = ({ item }: { item: Order }) => {
        const canCancel = (item.status === 'Pending' || item.status === 'Confirmed');

        return (
            <Card className="m-4 bg-white" elevation={1}>
                <Card.Title
                    title={`Order #${item.id.slice(-6)}`}
                    subtitle={new Date(item.createdAt).toLocaleString()}
                    right={(props) => (
                        <View className={`px-2 py-1 rounded mr-4 ${getStatusColor(item.status).split(' ')[0]}`}>
                            <Text className={`text-xs font-bold ${getStatusColor(item.status).split(' ')[1]}`}>
                                {item.status.toUpperCase()}
                            </Text>
                        </View>
                    )}
                />
                <Divider />
                <Card.Content className="py-3">
                    {item.items.map((prod, idx) => (
                        <View key={idx} className="flex-row justify-between mb-1">
                            <Text className="text-gray-600 flex-1">{prod.name} x{prod.quantity}</Text>
                            <Text className="font-medium">$ {(prod.price * prod.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                    <View className="flex-row justify-between mt-3">
                        <Text className="font-bold text-lg">Total</Text>
                        <Text className="font-bold text-lg text-blue-600">$ {item.totalAmount.toFixed(2)}</Text>
                    </View>
                </Card.Content>
                {canCancel && (
                    <>
                        <Divider />
                        <View className="p-2 items-end">
                            <Button
                                mode="text"
                                textColor="#ef4444"
                                onPress={() => cancelMutation.mutate(item.id)}
                                loading={cancelMutation.isPending}
                            >
                                Cancel Order
                            </Button>
                        </View>
                    </>
                )}
            </Card>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="p-4 bg-white border-bottom border-gray-200">
                <Text className="text-2xl font-bold">Order History</Text>
            </View>

            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <Text>Loading orders...</Text>
                </View>
            ) : orders.length === 0 ? (
                <View className="flex-1 justify-center items-center p-10">
                    <Text className="text-gray-500 text-center">No orders yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
                    }
                />
            )}
        </SafeAreaView>
    );
}
