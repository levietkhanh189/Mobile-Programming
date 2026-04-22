import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

const appVersion = Constants.expoConfig?.version ?? '1.0.0';
const buildNumber = (Constants.expoConfig?.runtimeVersion as string | undefined) ?? 'N/A';

export default function AboutSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Thông tin</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Phiên bản</Text>
        <Text style={styles.value}>{appVersion}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Build</Text>
        <Text style={styles.value}>{buildNumber}</Text>
      </View>
      <Text style={styles.credit}>Made with ❤️ in Vietnam</Text>
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
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  value: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
  },
  credit: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
