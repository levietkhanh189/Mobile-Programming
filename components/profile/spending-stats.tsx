import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

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
    <View style={styles.box}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={styles.boxCount}>{count}</Text>
      <Text style={styles.boxLabel} numberOfLines={1}>{label}</Text>
      <Text style={styles.boxTotal}>{(total / 1000).toFixed(0)}k đ</Text>
    </View>
  );
}

interface Props {
  stats: Stats;
}

export default function SpendingStats({ stats }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thống kê chi tiêu</Text>
      <View style={styles.row}>
        <StatBox icon="checkmark-circle" label="Đã giao" count={stats.delivered.count} total={stats.delivered.total} color={COLORS.success} />
        <StatBox icon="time" label="Chờ xử lý" count={stats.pending.count} total={stats.pending.total} color={COLORS.warning} />
        <StatBox icon="close-circle" label="Đã hủy" count={stats.cancelled.count} total={stats.cancelled.total} color={COLORS.error} />
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Tổng đã chi</Text>
        <Text style={styles.totalValue}>{stats.totalSpent.toLocaleString('vi-VN')}đ</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  box: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  boxCount: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text,
    marginTop: 4,
  },
  boxLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  boxTotal: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  totalRow: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  totalValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.priceBig,
  },
});
