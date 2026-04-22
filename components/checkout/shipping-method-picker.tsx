import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

export interface ShippingMethod {
  id: string;
  name: string;
  fee: number;
  eta: string;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'standard', name: 'Tiêu chuẩn', fee: 0, eta: '3-5 ngày' },
  { id: 'express', name: 'Hỏa tốc', fee: 50000, eta: '1-2 ngày' },
];

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

export default function ShippingMethodPicker({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
      {SHIPPING_METHODS.map((method) => {
        const isSelected = selected === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => onSelect(method.id)}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
          >
            <View style={[styles.radio, isSelected && styles.radioSelected]}>
              {isSelected && <View style={styles.radioDot} />}
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{method.name}</Text>
              <Text style={styles.eta}>{method.eta}</Text>
            </View>
            <Text style={styles.fee}>
              {method.fee === 0 ? 'Miễn phí' : `${method.fee.toLocaleString('vi-VN')}đ`}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
    padding: SPACING.screenPadding,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF8F0',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    marginRight: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  info: { flex: 1 },
  name: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  eta: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  fee: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.link,
  },
});
