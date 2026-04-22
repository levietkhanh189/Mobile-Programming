import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

interface CartSelectAllHeaderProps {
    selectedCount: number;
    totalCount: number;
    onSetAllSelected: (value: boolean) => void;
}

export default function CartSelectAllHeader({
    selectedCount,
    totalCount,
    onSetAllSelected,
}: CartSelectAllHeaderProps) {
    const allSelected = totalCount > 0 && selectedCount === totalCount;
    const someSelected = selectedCount > 0 && selectedCount < totalCount;
    const checkboxStatus = allSelected ? 'checked' : someSelected ? 'indeterminate' : 'unchecked';

    const handlePress = () => {
        onSetAllSelected(!allSelected);
    };

    return (
        <TouchableOpacity
            style={styles.row}
            onPress={handlePress}
            accessibilityLabel={allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            accessibilityRole="checkbox"
        >
            <Checkbox
                status={checkboxStatus}
                onPress={handlePress}
                color={COLORS.btnYellowBorder}
            />
            <Text style={styles.label}>
                Chọn tất cả ({selectedCount}/{totalCount})
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.screenPadding,
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    label: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
        color: COLORS.text,
        marginLeft: SPACING.xs,
    },
});
