import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

interface CartCheckoutBarProps {
    selectedCount: number;
    subtotal: number;
    savings: number;
    onCheckout: () => void;
}

const formatVND = (n: number) => Math.round(n).toLocaleString('vi-VN') + 'đ';

export default function CartCheckoutBar({
    selectedCount,
    subtotal,
    savings,
    onCheckout,
}: CartCheckoutBarProps) {
    const disabled = selectedCount === 0;

    return (
        <View style={styles.footer}>
            {savings > 0 && (
                <View style={styles.savingsRow}>
                    <IconSymbol name="tag.fill" size={14} color={COLORS.success} />
                    <Text style={styles.savingsText}>
                        Tiết kiệm <Text style={styles.savingsValue}>{formatVND(savings)}</Text>
                    </Text>
                </View>
            )}

            <View style={styles.totalRow}>
                <View style={styles.totalLeft}>
                    <Text style={styles.totalLabel}>Tổng tạm tính</Text>
                    <Text style={styles.totalAmount}>{formatVND(subtotal)}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.checkoutBtn, disabled && styles.checkoutBtnDisabled]}
                    onPress={onCheckout}
                    disabled={disabled}
                    accessibilityRole="button"
                    accessibilityLabel={`Thanh toán, tổng ${formatVND(subtotal)}`}
                    accessibilityState={{ disabled }}
                >
                    <Text style={[styles.checkoutText, disabled && styles.checkoutTextDisabled]}>
                        {disabled
                            ? 'Chọn sản phẩm'
                            : `Thanh toán (${selectedCount})`}
                    </Text>
                </TouchableOpacity>
            </View>
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
        paddingTop: SPACING.sm,
        paddingBottom: SPACING.xxl,
        borderTopWidth: 1,
        borderTopColor: COLORS.divider,
    },
    savingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#E6F5EE',
        borderRadius: 4,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        marginBottom: SPACING.sm,
        alignSelf: 'flex-start',
    },
    savingsText: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.success,
        fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    },
    savingsValue: {
        fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: SPACING.md,
    },
    totalLeft: { flex: 1 },
    totalLabel: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
        color: COLORS.textSecondary,
    },
    totalAmount: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
        color: COLORS.priceBig,
    },
    checkoutBtn: {
        backgroundColor: COLORS.btnYellow,
        borderWidth: 1,
        borderColor: COLORS.btnYellowBorder,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        minWidth: 160,
    },
    checkoutBtnDisabled: {
        backgroundColor: COLORS.divider,
        borderColor: COLORS.cardBorder,
    },
    checkoutText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
        color: COLORS.text,
    },
    checkoutTextDisabled: {
        color: COLORS.textSecondary,
    },
});
