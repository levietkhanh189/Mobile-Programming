import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

export interface Address {
  id: number;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  ward?: string;
  zipCode?: string;
  isDefault: boolean;
}

interface Props {
  addresses: Address[];
  onAdd: () => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
  onEdit: (address: Address) => void;
}

export default function AddressSection({ addresses, onAdd, onDelete, onSetDefault, onEdit }: Props) {
  const confirmDelete = (id: number) => {
    Alert.alert('Xóa địa chỉ', 'Bạn chắc chắn muốn xóa?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => onDelete(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Địa chỉ giao hàng</Text>
        <TouchableOpacity onPress={onAdd} style={styles.addBtn} accessibilityRole="button">
          <Text style={styles.addBtnText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>

      {addresses.map((addr) => (
        <View key={addr.id} style={styles.card}>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{addr.label}</Text>
            </View>
            {addr.isDefault && (
              <View style={[styles.tag, styles.tagDefault]}>
                <Text style={[styles.tagText, styles.tagDefaultText]}>Mặc định</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{addr.fullName} · {addr.phone}</Text>
          <Text style={styles.addressText}>
            {addr.address}
            {addr.ward ? `, ${addr.ward}` : ''}
            {addr.district ? `, ${addr.district}` : ''}
            {addr.zipCode ? ` ${addr.zipCode}` : ''}
            {`, ${addr.city}`}
          </Text>
          <View style={styles.actions}>
            {!addr.isDefault && (
              <TouchableOpacity onPress={() => onSetDefault(addr.id)}>
                <Text style={styles.actionLink}>Đặt mặc định</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => onEdit(addr)} style={styles.actionWithIcon}>
              <Ionicons name="pencil-outline" size={13} color={COLORS.link} />
              <Text style={styles.actionLink}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(addr.id)}>
              <Text style={[styles.actionLink, styles.deleteLink]}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {addresses.length === 0 && (
        <View style={styles.empty}>
          <Ionicons name="location-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Chưa có địa chỉ nào</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text,
  },
  addBtn: {
    backgroundColor: COLORS.btnYellow,
    borderWidth: 1,
    borderColor: COLORS.btnYellowBorder,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addBtnText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  tagRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  tag: {
    backgroundColor: '#E6F4F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.link,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
  },
  tagDefault: { backgroundColor: '#E6F5EE' },
  tagDefaultText: { color: COLORS.success },
  name: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  addressText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginTop: SPACING.sm },
  actionWithIcon: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionLink: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.link,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
  },
  deleteLink: { color: COLORS.error },
  empty: { paddingVertical: SPACING.lg, alignItems: 'center' },
  emptyText: {
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
});
