import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

export type PaymentMethodId = 'cod' | 'bank_transfer' | 'momo';

interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  description: string;
  available: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'cod', name: 'Thanh toán khi nhận hàng', description: 'COD', available: true },
  { id: 'bank_transfer', name: 'Chuyển khoản ngân hàng', description: 'Sắp ra mắt', available: false },
  { id: 'momo', name: 'Ví Momo', description: 'Sắp ra mắt', available: false },
];

interface Props {
  selected: PaymentMethodId;
  onSelect: (id: PaymentMethodId) => void;
}

export default function PaymentMethodPicker({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
      {PAYMENT_METHODS.map((method) => {
        const isSelected = selected === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.card,
              isSelected && styles.cardSelected,
              !method.available && styles.cardDisabled,
            ]}
            onPress={() => method.available && onSelect(method.id)}
            disabled={!method.available}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected, disabled: !method.available }}
          >
            <View style={[styles.radio, isSelected && styles.radioSelected]}>
              {isSelected && <View style={styles.radioDot} />}
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, !method.available && styles.textDisabled]}>
                {method.name}
              </Text>
              {!method.available && (
                <Text style={styles.badge}>{method.description}</Text>
              )}
            </View>
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
  cardDisabled: {
    backgroundColor: COLORS.background,
    opacity: 0.6,
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
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: COLORS.text,
  },
  textDisabled: {
    color: COLORS.textSecondary,
  },
  badge: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
