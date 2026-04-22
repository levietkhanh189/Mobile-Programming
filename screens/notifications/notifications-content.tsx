import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import { useNotificationStore, Notification } from '@/stores/notificationStore';
import { NotificationItem } from '@/components/notifications/notification-item';

export function NotificationsContent() {
  const { notifications, markRead, markAllRead, removeNotification } = useNotificationStore();

  const handlePress = (item: Notification) => {
    markRead(item.id);
    if (item.link) {
      router.push(item.link as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Quay lại"
        >
          <IconSymbol name="chevron.left" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity onPress={markAllRead} accessibilityLabel="Đánh dấu tất cả đã đọc">
          <Text style={styles.markAllBtn}>Đánh dấu đã đọc</Text>
        </TouchableOpacity>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol name="bell.slash" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onPress={handlePress}
              onDelete={removeNotification}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.headerBg,
    gap: SPACING.sm,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.white,
  },
  markAllBtn: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  list: {
    paddingBottom: 80,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
});
