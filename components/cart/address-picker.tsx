import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

export interface CartAddress {
  id: number;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
}

interface Props {
  addresses: CartAddress[];
  selectedAddressId: number | null;
  manualAddress: string;
  onSelectAddress: (id: number | null) => void;
  onChangeManualAddress: (text: string) => void;
}

export default function AddressPicker({
  addresses,
  selectedAddressId,
  manualAddress,
  onSelectAddress,
  onChangeManualAddress,
}: Props) {
  const usingManual = selectedAddressId === null;
  const hasSavedAddresses = addresses.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <IconSymbol name="location.fill" size={18} color={COLORS.primary} />
        <Text style={styles.title}>Địa chỉ giao hàng</Text>
        <Text style={styles.required}>*</Text>
      </View>

      {!hasSavedAddresses && (
        <Text style={styles.hintText}>
          Bạn chưa có địa chỉ đã lưu. Vui lòng nhập địa chỉ giao hàng bên dưới.
        </Text>
      )}

      {addresses.map((addr) => {
        const selected = selectedAddressId === addr.id;
        return (
          <TouchableOpacity
            key={addr.id}
            onPress={() => onSelectAddress(addr.id)}
            style={[styles.row, selected && styles.rowSelected]}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
          >
            <View style={[styles.radio, selected && styles.radioSelected]}>
              {selected && <View style={styles.radioDot} />}
            </View>
            <View style={styles.info}>
              <View style={styles.tagRow}>
                <View style={styles.labelTag}>
                  <Text style={styles.labelTagText}>{addr.label}</Text>
                </View>
                {addr.isDefault && (
                  <View style={[styles.labelTag, styles.defaultTag]}>
                    <Text style={[styles.labelTagText, styles.defaultTagText]}>Mặc định</Text>
                  </View>
                )}
              </View>
              <Text style={styles.name}>{addr.fullName} · {addr.phone}</Text>
              <Text style={styles.addrText}>
                {addr.address}, {addr.city}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {hasSavedAddresses && (
        <TouchableOpacity
          onPress={() => onSelectAddress(null)}
          style={[styles.row, styles.manualToggle, usingManual && styles.rowSelected]}
          accessibilityRole="radio"
          accessibilityState={{ checked: usingManual }}
        >
          <View style={[styles.radio, usingManual && styles.radioSelected]}>
            {usingManual && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.manualLabel}>Sử dụng địa chỉ khác</Text>
        </TouchableOpacity>
      )}

      {usingManual && (
        <View style={styles.manualBox}>
          <Text style={styles.manualHint}>
            Nhập đầy đủ: số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố
          </Text>
          <TextInput
            value={manualAddress}
            onChangeText={onChangeManualAddress}
            placeholder="VD: 123 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM"
            placeholderTextColor={COLORS.textMuted}
            style={styles.input}
            multiline
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: SPACING.screenPadding,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text,
  },
  required: { color: COLORS.error, fontFamily: TYPOGRAPHY.fontFamily.poppins.bold },
  hintText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  rowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF8F0',
  },
  manualToggle: {
    borderStyle: 'dashed',
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
  radioSelected: { borderColor: COLORS.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  info: { flex: 1 },
  tagRow: { flexDirection: 'row', gap: 4, marginBottom: 4 },
  labelTag: {
    backgroundColor: '#E6F4F1',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  labelTagText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.link,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
  },
  defaultTag: { backgroundColor: '#E6F5EE' },
  defaultTagText: { color: COLORS.success },
  name: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  addrText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  manualLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
  },
  manualBox: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: SPACING.sm,
    marginTop: 4,
  },
  manualHint: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginBottom: 6,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    minHeight: 70,
    textAlignVertical: 'top',
  },
});
