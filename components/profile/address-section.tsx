import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Address {
  id: number;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
}

interface Props {
  addresses: Address[];
  onAdd: () => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
}

export default function AddressSection({ addresses, onAdd, onDelete, onSetDefault }: Props) {
  const confirmDelete = (id: number) => {
    Alert.alert('Xóa địa chỉ', 'Bạn chắc chắn muốn xóa?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => onDelete(id) },
    ]);
  };

  return (
    <View className="mx-4 mb-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white font-bold text-base">Địa chỉ giao hàng</Text>
        <TouchableOpacity onPress={onAdd} className="bg-blue-500/30 rounded-lg px-3 py-1">
          <Text className="text-blue-400 text-sm">+ Thêm</Text>
        </TouchableOpacity>
      </View>
      {addresses.map(addr => (
        <View key={addr.id} className="bg-white/10 rounded-xl p-3 mb-2">
          <View className="flex-row items-center mb-1">
            <View className="bg-blue-500/30 rounded px-2 py-0.5 mr-2">
              <Text className="text-blue-400 text-xs">{addr.label}</Text>
            </View>
            {addr.isDefault && (
              <View className="bg-green-500/30 rounded px-2 py-0.5">
                <Text className="text-green-400 text-xs">Mặc định</Text>
              </View>
            )}
          </View>
          <Text className="text-white font-medium">{addr.fullName} · {addr.phone}</Text>
          <Text className="text-white/70 text-sm mt-0.5">{addr.address}, {addr.city}</Text>
          <View className="flex-row mt-2 gap-3">
            {!addr.isDefault && (
              <TouchableOpacity onPress={() => onSetDefault(addr.id)}>
                <Text className="text-blue-400 text-xs">Đặt mặc định</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => confirmDelete(addr.id)}>
              <Text className="text-red-400 text-xs">Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {addresses.length === 0 && (
        <View className="py-4 items-center">
          <Ionicons name="location-outline" size={32} color="rgba(255,255,255,0.3)" />
          <Text className="text-white/50 mt-2">Chưa có địa chỉ nào</Text>
        </View>
      )}
    </View>
  );
}
