/**
 * OrderStatusTimeline — visual step-by-step order status indicator.
 * Shows Pending → Confirmed → Processing → Shipping → Delivered as connected dots.
 * Cancelled orders show a red badge instead.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import { OrderStatus, OrderStatusHistoryItem } from '@/services/api';

const STEPS: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipping', 'Delivered'];

const STEP_LABELS: Record<OrderStatus, string> = {
  Pending: 'Chờ xác nhận',
  Confirmed: 'Đã xác nhận',
  Processing: 'Đang xử lý',
  Shipping: 'Đang giao',
  Delivered: 'Đã giao',
  Cancelled: 'Đã hủy',
};

interface Props {
  currentStatus: OrderStatus;
  history?: OrderStatusHistoryItem[];
}

export function OrderStatusTimeline({ currentStatus, history }: Props) {
  if (currentStatus === 'Cancelled') {
    return (
      <View style={styles.cancelledContainer}>
        <View style={styles.cancelledBadge}>
          <Text style={styles.cancelledText}>Đã hủy</Text>
        </View>
        {history && history.length > 0 && (
          <Text style={styles.cancelledAt}>
            {new Date(history[history.length - 1].timestamp).toLocaleString('vi-VN')}
          </Text>
        )}
      </View>
    );
  }

  const currentIndex = STEPS.indexOf(currentStatus);

  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const historyEntry = history?.find((h) => h.status === step);

        return (
          <View key={step} style={styles.stepRow}>
            {/* Dot + connector */}
            <View style={styles.dotColumn}>
              <View
                style={[
                  styles.dot,
                  isCompleted && styles.dotCompleted,
                  isActive && styles.dotActive,
                ]}
              >
                {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                {isActive && <View style={styles.dotInner} />}
              </View>
              {index < STEPS.length - 1 && (
                <View style={[styles.connector, isCompleted && styles.connectorCompleted]} />
              )}
            </View>

            {/* Label + timestamp */}
            <View style={styles.labelColumn}>
              <Text
                style={[
                  styles.stepLabel,
                  isActive && styles.stepLabelActive,
                  isCompleted && styles.stepLabelCompleted,
                ]}
              >
                {STEP_LABELS[step]}
              </Text>
              {historyEntry && (
                <Text style={styles.timestamp}>
                  {new Date(historyEntry.timestamp).toLocaleString('vi-VN')}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: SPACING.sm },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', minHeight: 44 },
  dotColumn: { alignItems: 'center', width: 28 },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  dotActive: { borderColor: COLORS.primary, borderWidth: 2.5 },
  dotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  checkmark: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },
  connector: { width: 2, flex: 1, minHeight: 16, backgroundColor: COLORS.divider, marginVertical: 2 },
  connectorCompleted: { backgroundColor: COLORS.success },
  labelColumn: { flex: 1, paddingLeft: SPACING.sm, paddingBottom: SPACING.sm },
  stepLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.regular,
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
  },
  stepLabelCompleted: {
    color: COLORS.success,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
  },
  timestamp: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textMuted, marginTop: 2 },
  cancelledContainer: { paddingVertical: SPACING.sm, alignItems: 'flex-start' },
  cancelledBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  cancelledText: {
    color: '#991B1B',
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  cancelledAt: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textMuted, marginTop: SPACING.xs },
});
