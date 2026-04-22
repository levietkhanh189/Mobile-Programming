import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

const ITEMS = [
  {
    title: 'Điều khoản dịch vụ',
    onPress: () => Alert.alert('Sắp ra mắt', 'Tính năng này sẽ sớm được cập nhật.'),
  },
  {
    title: 'Chính sách bảo mật',
    onPress: () => Alert.alert('Sắp ra mắt', 'Tính năng này sẽ sớm được cập nhật.'),
  },
  {
    title: 'Liên hệ hỗ trợ',
    onPress: () => Linking.openURL('mailto:support@example.com').catch(() =>
      Alert.alert('Lỗi', 'Không thể mở ứng dụng email.')
    ),
  },
];

export default function HelpLegalSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Trợ giúp & Pháp lý</Text>
      {ITEMS.map((item, index) => (
        <TouchableOpacity
          key={item.title}
          style={[styles.row, index === ITEMS.length - 1 && styles.lastRow]}
          onPress={item.onPress}
          accessibilityRole="button"
        >
          <Text style={styles.rowTitle}>{item.title}</Text>
          <IconSymbol name="chevron.right" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.screenPadding,
    marginTop: SPACING.md,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  lastRow: { borderBottomWidth: 0 },
});
