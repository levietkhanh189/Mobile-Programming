import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '@/constants/theme-colors';

interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: { fullName: string };
}

interface Props {
  reviews: Review[];
}

export default function ReviewRatingBreakdown({ reviews }: Props) {
  const total = reviews.length;
  const avg = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;

  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    counts[star] = (counts[star] || 0) + 1;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.avgText}>{avg.toFixed(1)}</Text>
        <Ionicons name="star" size={22} color="#f59e0b" style={styles.starIcon} />
        <Text style={styles.totalText}>({total} đánh giá)</Text>
      </View>
      {[5, 4, 3, 2, 1].map(star => {
        const count = counts[star] || 0;
        const pct = total > 0 ? count / total : 0;
        return (
          <View key={star} style={styles.row}>
            <Text style={styles.label}>{star}★</Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${pct * 100}%` as any }]} />
            </View>
            <Text style={styles.count}>({count})</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, marginBottom: 8 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avgText: {
    color: COLORS.text,
    fontSize: 28,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    marginRight: 4,
  },
  starIcon: { marginRight: 4 },
  totalText: { color: COLORS.textSecondary, fontSize: 14 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  label: { color: COLORS.text, width: 28, fontSize: 13 },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.divider,
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  barFill: { height: 8, backgroundColor: '#f59e0b', borderRadius: 4 },
  count: { color: COLORS.textSecondary, fontSize: 12, width: 36, textAlign: 'right' },
});
