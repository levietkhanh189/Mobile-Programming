import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { HomeContent } from '@/components/home/HomeContent';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, TYPOGRAPHY } from '@/constants/theme-colors';
import { router } from 'expo-router';
import { useNotificationStore } from '@/stores/notificationStore';

export default function HomeScreen() {
  const unreadCount = useNotificationStore((state) => state.unreadCount());

  return (
    <SafeAreaView style={styles.container}>
      {/* Amazon-style dark header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Bookly</Text>
        <View style={styles.headerActions}>
          {/* Bell icon with unread badge */}
          <TouchableOpacity
            onPress={() => router.push('/notifications' as any)}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel={`Thông báo${unreadCount > 0 ? `, ${unreadCount} chưa đọc` : ''}`}
          >
            <IconSymbol name="bell.fill" size={24} color={COLORS.white} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          {/* Profile icon */}
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <IconSymbol name="person.circle.fill" size={28} color={COLORS.white} />
          </TouchableOpacity>
        </View>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    color: COLORS.white,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    lineHeight: 12,
  },
  content: {
    flex: 1,
  },
});
