import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { COLORS, SPACING } from '@/constants/theme-colors';

export const OrderCardSkeleton = () => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Skeleton width={120} height={16} borderRadius={4} />
        <Skeleton width={80} height={12} borderRadius={4} style={styles.gap} />
      </View>
      <Skeleton width={70} height={24} borderRadius={4} />
    </View>
    <View style={styles.divider} />
    <Skeleton width="85%" height={13} borderRadius={4} />
    <Skeleton width="65%" height={13} borderRadius={4} style={styles.gap} />
    <View style={styles.totalRow}>
      <Skeleton width={80} height={14} borderRadius={4} />
      <Skeleton width={60} height={18} borderRadius={4} />
    </View>
  </View>
);

export const OrderListSkeleton = ({ count = 3 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <OrderCardSkeleton key={i} />
    ))}
  </>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.md,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: { gap: 0 },
  gap: { marginTop: 6 },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: SPACING.sm },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
});
