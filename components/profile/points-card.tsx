import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

interface Props {
  points: number;
}

export default function PointsCard({ points }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="trophy" size={32} color={COLORS.primary} />
      <View style={styles.body}>
        <Text style={styles.points}>{points.toLocaleString()}</Text>
        <Text style={styles.label}>Điểm tích lũy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.md,
    backgroundColor: '#FFF8F0',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: { marginLeft: SPACING.md },
  points: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.warning,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
});
