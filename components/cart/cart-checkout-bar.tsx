import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

interface CartCheckoutBarProps {
    selectedCount: number;
    total: number;
    onCheckout: () => void;
}

export default function CartCheckoutBar({
    selectedCount,
    total,
    onCheckout,
}: CartCheckoutBarProps) {
    const disabled = selectedCount === 0;

    return (
        <View style={styles.footer}>
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                    Tổng ({selectedCount} sản phẩm):
                </Text>
                <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
                style={[styles.checkoutBtn, disabled && styles.checkoutBtnDisabled]}
                onPress={onCheckout}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={`Thanh toán, tổng $${total.toFixed(2)}`}
                accessibilityState={{ disabled }}
            >
                <Text style={[styles.checkoutText, disabled && styles.checkoutTextDisabled]}>
                    Tiến hành thanh toán
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.screenPadding,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.xxl,
        borderTopWidth: 1,
        borderTopColor: COLORS.divider,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    totalLabel: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
        color: COLORS.text,
    },
    totalAmount: {
        fontSize: TYPOGRAPHY.fontSize['2xl'],
        fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
        color: COLORS.priceBig,
    },
    checkoutBtn: {
        backgroundColor: COLORS.btnYellow,
        borderWidth: 1,
        borderColor: COLORS.btnYellowBorder,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    checkoutBtnDisabled: {
        backgroundColor: COLORS.divider,
        borderColor: COLORS.cardBorder,
    },
    checkoutText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
        color: COLORS.text,
    },
    checkoutTextDisabled: {
        color: COLORS.textSecondary,
    },
});
