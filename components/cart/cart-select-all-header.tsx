import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

interface CartSelectAllHeaderProps {
    selectedCount: number;
    totalCount: number;
    onSetAllSelected: (value: boolean) => void;
    onRemoveSelected?: () => void;
}

export default function CartSelectAllHeader({
    selectedCount,
    totalCount,
    onSetAllSelected,
    onRemoveSelected,
}: CartSelectAllHeaderProps) {
    const allSelected = totalCount > 0 && selectedCount === totalCount;
    const someSelected = selectedCount > 0 && selectedCount < totalCount;
    const checkboxStatus = allSelected ? 'checked' : someSelected ? 'indeterminate' : 'unchecked';

    const togglePress = () => {
        onSetAllSelected(!allSelected);
    };

    const confirmDeleteSelected = () => {
        if (!onRemoveSelected || selectedCount === 0) return;
        Alert.alert(
            'Xóa sản phẩm đã chọn',
            `Xóa ${selectedCount} sản phẩm khỏi giỏ hàng?`,
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', style: 'destructive', onPress: onRemoveSelected },
            ]
        );
    };

    return (
        <View style={styles.row}>
            <TouchableOpacity
                onPress={togglePress}
                style={styles.left}
                accessibilityLabel={allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                accessibilityRole="checkbox"
            >
                <Checkbox
                    status={checkboxStatus}
                    onPress={togglePress}
                    color={COLORS.primary}
                />
                <Text style={styles.label}>
                    Chọn tất cả ({selectedCount}/{totalCount})
                </Text>
            </TouchableOpacity>

            {selectedCount > 0 && onRemoveSelected && (
                <TouchableOpacity
                    onPress={confirmDeleteSelected}
                    style={styles.deleteBtn}
                    accessibilityRole="button"
                    accessibilityLabel={`Xóa ${selectedCount} sản phẩm đã chọn`}
                >
                    <IconSymbol name="trash" size={16} color={COLORS.error} />
                    <Text style={styles.deleteText}>Xóa ({selectedCount})</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.screenPadding,
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    label: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
        color: COLORS.text,
        marginLeft: SPACING.xs,
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    deleteText: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.error,
        fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    },
});
