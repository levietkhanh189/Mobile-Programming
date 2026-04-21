import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

export interface CartAddress {
  id: number;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
}

interface Props {
  addresses: CartAddress[];
  selectedAddressId: number | null;
  manualAddress: string;
  onSelectAddress: (id: number | null) => void;
  onChangeManualAddress: (text: string) => void;
}

export default function AddressPicker({
  addresses,
  selectedAddressId,
  manualAddress,
  onSelectAddress,
  onChangeManualAddress,
}: Props) {
  return (
    <View className="mx-4 mb-4 bg-white/10 rounded-2xl p-4">
      <Text className="text-white font-bold mb-3">Địa chỉ giao hàng</Text>
      {addresses.map((addr) => (
        <TouchableOpacity
          key={addr.id}
          onPress={() => onSelectAddress(addr.id)}
          className={`flex-row items-center p-3 rounded-xl mb-2 border ${
            selectedAddressId === addr.id
              ? 'border-blue-400 bg-blue-500/20'
              : 'border-white/10'
          }`}
        >
          <View
            className={`w-5 h-5 rounded-full border-2 mr-3 ${
              selectedAddressId === addr.id
                ? 'border-blue-400 bg-blue-400'
                : 'border-white/40'
            }`}
          />
          <View className="flex-1">
            <Text className="text-white text-sm font-medium">
              {addr.fullName} · {addr.label}
            </Text>
            <Text className="text-white/60 text-xs">
              {addr.address}, {addr.city}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={() => onSelectAddress(null)}
        className={`p-3 rounded-xl border mb-2 ${
          selectedAddressId === null && addresses.length > 0
            ? 'border-blue-400 bg-blue-500/20'
            : 'border-white/10'
        }`}
      >
        <Text className="text-white/80 text-sm">+ Nhập địa chỉ khác</Text>
      </TouchableOpacity>
      {selectedAddressId === null && (
        <TextInput
          value={manualAddress}
          onChangeText={onChangeManualAddress}
          placeholder="Nhập địa chỉ giao hàng..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          className="bg-white/10 text-white rounded-xl px-4 py-3 mt-2"
          multiline
        />
      )}
    </View>
  );
}
