import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { HomeContent } from '@/components/home/HomeContent';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, TYPOGRAPHY } from '@/constants/theme-colors';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Amazon-style dark header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Indie Store</Text>
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          style={styles.profileBtn}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          <IconSymbol name="person.circle.fill" size={28} color={COLORS.white} />
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.headerBg,
  },
  logo: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.white,
  },
  profileBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
});
