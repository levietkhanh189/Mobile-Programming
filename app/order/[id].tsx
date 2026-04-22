/**
 * Route: /order/[id] — Order detail page.
 * Thin wrapper that renders OrderDetailContent with the order id from route params.
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { OrderDetailContent } from '@/screens/order/order-detail-content';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

export default function OrderDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          Chi tiết đơn hàng {id ? `#${String(id).slice(-6).toUpperCase()}` : ''}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <OrderDetailContent orderId={String(id ?? '')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.headerBg,
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.md,
    paddingTop: SPACING.xl,
  },
  backButton: { padding: SPACING.xs, marginRight: SPACING.sm },
  backArrow: { fontSize: 20, color: COLORS.headerText, fontWeight: 'bold' },
  headerTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.headerText,
    textAlign: 'center',
  },
  headerRight: { width: 28 },
});
