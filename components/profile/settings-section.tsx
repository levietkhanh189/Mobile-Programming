import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Switch, Menu, Divider } from 'react-native-paper';
import { usePreferencesStore, Language, ThemeMode } from '@/stores/preferencesStore';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

const LANGUAGE_LABELS: Record<Language, string> = { vi: 'Tiếng Việt', en: 'English' };
const THEME_LABELS: Record<ThemeMode, string> = { light: 'Sáng', dark: 'Tối', system: 'Hệ thống' };

export default function SettingsSection() {
  const {
    notifyOrders, setNotifyOrders,
    notifyPromos, setNotifyPromos,
    notifyNewProducts, setNotifyNewProducts,
    language, setLanguage,
    themeMode, setThemeMode,
  } = usePreferencesStore();

  const [langMenuVisible, setLangMenuVisible] = useState(false);
  const [themeMenuVisible, setThemeMenuVisible] = useState(false);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Cài đặt</Text>

      {/* Notification toggles */}
      <Text style={styles.subHeader}>Thông báo</Text>
      <ToggleRow label="Cập nhật đơn hàng" value={notifyOrders} onToggle={setNotifyOrders} />
      <ToggleRow label="Khuyến mãi" value={notifyPromos} onToggle={setNotifyPromos} />
      <ToggleRow label="Sản phẩm mới" value={notifyNewProducts} onToggle={setNotifyNewProducts} last />

      {/* Language selector */}
      <Text style={styles.subHeader}>Ngôn ngữ</Text>
      <Menu
        visible={langMenuVisible}
        onDismiss={() => setLangMenuVisible(false)}
        anchor={
          <TouchableOpacity style={styles.selectorRow} onPress={() => setLangMenuVisible(true)}>
            <Text style={styles.menuTitle}>Ngôn ngữ</Text>
            <View style={styles.selectorRight}>
              <Text style={styles.selectorValue}>{LANGUAGE_LABELS[language]}</Text>
              <IconSymbol name="chevron.right" size={16} color={COLORS.textMuted} />
            </View>
          </TouchableOpacity>
        }
      >
        {(Object.keys(LANGUAGE_LABELS) as Language[]).map((k) => (
          <Menu.Item key={k} onPress={() => { setLanguage(k); setLangMenuVisible(false); }}
            title={LANGUAGE_LABELS[k]} />
        ))}
      </Menu>

      {/* Theme selector */}
      <Text style={styles.subHeader}>Giao diện</Text>
      <Menu
        visible={themeMenuVisible}
        onDismiss={() => setThemeMenuVisible(false)}
        anchor={
          <TouchableOpacity style={[styles.selectorRow, styles.lastRow]} onPress={() => setThemeMenuVisible(true)}>
            <Text style={styles.menuTitle}>Chủ đề</Text>
            <View style={styles.selectorRight}>
              <Text style={styles.selectorValue}>{THEME_LABELS[themeMode]}</Text>
              <IconSymbol name="chevron.right" size={16} color={COLORS.textMuted} />
            </View>
          </TouchableOpacity>
        }
      >
        {(Object.keys(THEME_LABELS) as ThemeMode[]).map((k) => (
          <Menu.Item key={k} onPress={() => { setThemeMode(k); setThemeMenuVisible(false); }}
            title={THEME_LABELS[k]} />
        ))}
      </Menu>
    </View>
  );
}

function ToggleRow({ label, value, onToggle, last }: {
  label: string; value: boolean; onToggle: (v: boolean) => void; last?: boolean;
}) {
  return (
    <View style={[styles.toggleRow, last && styles.lastRow]}>
      <Text style={styles.menuTitle}>{label}</Text>
      <Switch value={value} onValueChange={onToggle} color={COLORS.primary} />
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
  subHeader: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  selectorRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  selectorValue: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary },
  menuTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  lastRow: { borderBottomWidth: 0 },
});
