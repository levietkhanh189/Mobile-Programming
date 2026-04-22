import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { COLORS, DEVICE, SPACING } from '@/constants/theme-colors';

const CARD_WIDTH = (DEVICE.width - SPACING.screenPadding * 2 - 10) / 2;

export const ProductCardSkeleton = () => (
  <View style={styles.card}>
    <Skeleton width={CARD_WIDTH} height={140} borderRadius={0} />
    <View style={styles.info}>
      <Skeleton width="90%" height={14} borderRadius={4} />
      <Skeleton width="60%" height={14} borderRadius={4} style={styles.gap} />
      <Skeleton width="45%" height={18} borderRadius={4} style={styles.gap} />
      <View style={styles.bottom}>
        <Skeleton width={50} height={12} borderRadius={4} />
        <Skeleton width={30} height={30} borderRadius={4} />
      </View>
    </View>
  </View>
);

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </>
);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    marginBottom: 10,
  },
  info: { padding: 8, gap: 0 },
  gap: { marginTop: 6 },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
});
