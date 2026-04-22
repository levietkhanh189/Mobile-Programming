import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CartItem } from '@/stores/cartStore';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';

interface CartLineItemProps {
    item: CartItem;
    onToggleSelected: (productId: number) => void;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
}

const formatUSD = (n: number) => '$' + n.toFixed(2);

export default function CartLineItem({
    item,
    onToggleSelected,
    onUpdateQuantity,
    onRemove,
}: CartLineItemProps) {
    const hasDiscount = (item.discountPercentage ?? 0) > 0;
    const finalPrice = hasDiscount
        ? item.price * (1 - item.discountPercentage / 100)
        : item.price;
    const subtotal = finalPrice * item.quantity;

    const confirmRemove = () => {
        Alert.alert(
            'Xóa sản phẩm',
            `Xóa "${item.name}" khỏi giỏ hàng?`,
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', style: 'destructive', onPress: () => onRemove(item.id) },
            ]
        );
    };

    return (
        <View style={[styles.card, item.selected && styles.cardSelected]}>
            <TouchableOpacity
                onPress={() => onToggleSelected(item.id)}
                style={styles.checkboxWrap}
                accessibilityLabel={`${item.selected ? 'Bỏ chọn' : 'Chọn'} ${item.name}`}
                accessibilityRole="checkbox"
            >
                <Checkbox
                    status={item.selected ? 'checked' : 'unchecked'}
                    onPress={() => onToggleSelected(item.id)}
                    color={COLORS.primary}
                />
            </TouchableOpacity>

            <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

            <View style={styles.cardBody}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>

                <View style={styles.priceRow}>
                    <Text style={styles.price}>{formatUSD(finalPrice)}</Text>
                    {hasDiscount && (
                        <>
                            <Text style={styles.priceOriginal}>{formatUSD(item.price)}</Text>
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>-{Math.round(item.discountPercentage)}%</Text>
                            </View>
                        </>
                    )}
                </View>

                <Text style={styles.subtotal}>Tạm tính: <Text style={styles.subtotalValue}>{formatUSD(subtotal)}</Text></Text>

                <View style={styles.cardActions}>
                    <View style={styles.qtyRow}>
                        <TouchableOpacity
                            onPress={() => {
                                if (item.quantity <= 1) {
                                    confirmRemove();
                                } else {
                                    onUpdateQuantity(item.id, item.quantity - 1);
                                }
                            }}
                            style={styles.qtyBtn}
                            accessibilityLabel="Giảm số lượng"
                        >
                            <Text style={styles.qtyBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity
                            onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            style={styles.qtyBtn}
                            accessibilityLabel="Tăng số lượng"
                        >
                            <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={confirmRemove}
                        style={styles.trashBtn}
                        accessibilityLabel={`Xóa ${item.name}`}
                        accessibilityRole="button"
                    >
                        <IconSymbol name="trash" size={20} color={COLORS.error} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        borderRadius: 8,
        marginBottom: 10,
        overflow: 'hidden',
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    cardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: '#FFFBF5',
    },
    checkboxWrap: {
        width: 40,
        minHeight: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: { width: 100, height: 100, borderRadius: 4, backgroundColor: COLORS.background },
    cardBody: { flex: 1, padding: 10, justifyContent: 'space-between' },
    itemName: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
        color: COLORS.text,
        lineHeight: 18,
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
    },
    price: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
        color: COLORS.priceBig,
    },
    priceOriginal: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.textMuted,
        textDecorationLine: 'line-through',
    },
    discountBadge: {
        backgroundColor: COLORS.error,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 3,
    },
    discountText: {
        color: COLORS.white,
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    },
    subtotal: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
        color: COLORS.textSecondary,
        marginBottom: 6,
    },
    subtotalValue: {
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        borderRadius: 6,
        overflow: 'hidden',
    },
    qtyBtn: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    qtyBtnText: { fontSize: 18, color: COLORS.text, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium },
    qtyText: {
        minWidth: 32,
        textAlign: 'center',
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
        color: COLORS.text,
        backgroundColor: COLORS.white,
        lineHeight: 36,
    },
    trashBtn: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
