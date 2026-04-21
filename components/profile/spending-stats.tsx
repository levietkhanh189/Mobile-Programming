import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatGroup {
  count: number;
  total: number;
}

interface Stats {
  delivered: StatGroup;
  pending: StatGroup;
  cancelled: StatGroup;
  totalSpent: number;
  totalOrders: number;
}

interface StatBoxProps {
  icon: string;
  label: string;
  count: number;
  total: number;
  color: string;
}

function StatBox({ icon, label, count, total, color }: StatBoxProps) {
  return (
    <View className="flex-1 bg-white/10 rounded-xl p-3 items-center">
      <Ionicons name={icon as any} size={20} color={color} />
      <Text className="text-white font-bold text-lg mt-1">{count}</Text>
      <Text className="text-white/60 text-xs text-center" numberOfLines={1}>{label}</Text>
      <Text className="text-white/80 text-xs mt-1">{(total / 1000).toFixed(0)}k đ</Text>
    </View>
  );
}

interface Props {
  stats: Stats;
}

export default function SpendingStats({ stats }: Props) {
  return (
    <View className="mx-4 mb-4">
      <Text className="text-white font-bold text-base mb-3">Thống kê chi tiêu</Text>
      <View className="flex-row gap-2 mb-3">
        <StatBox icon="checkmark-circle" label="Đã giao" count={stats.delivered.count} total={stats.delivered.total} color="#22c55e" />
        <StatBox icon="time" label="Chờ xử lý" count={stats.pending.count} total={stats.pending.total} color="#f59e0b" />
        <StatBox icon="close-circle" label="Đã hủy" count={stats.cancelled.count} total={stats.cancelled.total} color="#ef4444" />
      </View>
      <View className="bg-white/10 rounded-xl p-3 flex-row justify-between items-center">
        <Text className="text-white/70">Tổng đã chi</Text>
        <Text className="text-white font-bold">{stats.totalSpent.toLocaleString('vi-VN')}đ</Text>
      </View>
    </View>
  );
}
