import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { HomeContent } from '@/components/home/HomeContent';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { GLASS_COLORS, SHADOWS, TYPOGRAPHY, SPACING } from '@/constants/theme-colors';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.storeName}>Indie Store</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          style={styles.avatarButton}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          <IconSymbol name="person.circle.fill" size={36} color={GLASS_COLORS.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <HomeContent />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLASS_COLORS.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.md,
    backgroundColor: GLASS_COLORS.white,
    ...SHADOWS.sm,
  },
  greeting: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: GLASS_COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  storeName: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: GLASS_COLORS.text,
    letterSpacing: 0.3,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GLASS_COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
});
