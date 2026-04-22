import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
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

export default function CartLineItem({
    item,
    onToggleSelected,
    onUpdateQuantity,
    onRemove,
}: CartLineItemProps) {
    const subtotal = item.price * item.quantity;

    return (
        <View style={styles.card}>
            {/* Checkbox */}
            <TouchableOpacity
                onPress={() => onToggleSelected(item.id)}
                style={styles.checkboxWrap}
                accessibilityLabel={`${item.selected ? 'Bỏ chọn' : 'Chọn'} ${item.name}`}
                accessibilityRole="checkbox"
            >
                <Checkbox
                    status={item.selected ? 'checked' : 'unchecked'}
                    onPress={() => onToggleSelected(item.id)}
                    color={COLORS.btnYellowBorder}
                />
            </TouchableOpacity>

            {/* Product image */}
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

            {/* Details */}
            <View style={styles.cardBody}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <Text style={styles.subtotal}>Tổng: ${subtotal.toFixed(2)}</Text>

                <View style={styles.cardActions}>
                    {/* Quantity stepper */}
                    <View style={styles.qtyRow}>
                        <TouchableOpacity
                            onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            style={styles.qtyBtn}
                            accessibilityLabel="Giảm số lượng"
                        >
                            <Text style={styles.qtyBtnText}>-</Text>
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

                    {/* Trash icon */}
                    <TouchableOpacity
                        onPress={() => onRemove(item.id)}
                        style={styles.trashBtn}
                        accessibilityLabel={`Xóa ${item.name}`}
                        accessibilityRole="button"
                    >
                        <IconSymbol name="trash" size={20} color={COLORS.textSecondary} />
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
        borderRadius: 4,
        marginBottom: 10,
        overflow: 'hidden',
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    checkboxWrap: {
        width: 44,
        minHeight: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: { width: 150, height: 150 },
    cardBody: { flex: 1, padding: 10, justifyContent: 'space-between' },
    itemName: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
        color: COLORS.text,
        lineHeight: 18,
        marginBottom: 4,
    },
    price: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
        color: COLORS.priceBig,
    },
    subtotal: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
        color: COLORS.textSecondary,
        marginBottom: 6,
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
        borderRadius: 4,
        overflow: 'hidden',
    },
    qtyBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    qtyBtnText: { fontSize: 18, color: COLORS.text },
    qtyText: {
        minWidth: 34,
        textAlign: 'center',
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
        color: COLORS.text,
        backgroundColor: COLORS.white,
        lineHeight: 44,
    },
    trashBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
