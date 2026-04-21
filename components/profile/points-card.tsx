import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  points: number;
}

export default function PointsCard({ points }: Props) {
  return (
    <View className="mx-4 mb-4 bg-gradient-to-r from-amber-500/30 to-yellow-500/20 border border-amber-400/30 rounded-2xl p-4 flex-row items-center">
      <Ionicons name="trophy" size={32} color="#f59e0b" />
      <View className="ml-3">
        <Text className="text-amber-400 text-2xl font-bold">{points.toLocaleString()}</Text>
        <Text className="text-white/70 text-sm">Điểm tích lũy</Text>
      </View>
    </View>
  );
}
