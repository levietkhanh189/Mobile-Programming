import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import { Notification } from '@/stores/notificationStore';

interface Props {
  item: Notification;
  onPress: (item: Notification) => void;
  onDelete: (id: string) => void;
}

const TYPE_ICONS: Record<Notification['type'], string> = {
  order: 'shippingbox.fill',
  promo: 'tag.fill',
  system: 'bell.fill',
};

const TYPE_COLORS: Record<Notification['type'], string> = {
  order: COLORS.success,
  promo: COLORS.primary,
  system: COLORS.link,
};

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  return `${Math.floor(hrs / 24)} ngày trước`;
}

export function NotificationItem({ item, onPress, onDelete }: Props) {
  const iconColor = TYPE_COLORS[item.type];

  return (
    <TouchableOpacity
      style={[styles.container, !item.read && styles.unread]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconColor + '20' }]}>
        <IconSymbol name={TYPE_ICONS[item.type] as any} size={20} color={iconColor} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          {!item.read && <View style={styles.dot} />}
          <Text style={[styles.title, !item.read && styles.titleBold]} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        <Text style={styles.bodyText} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel="Xóa thông báo"
      >
        <IconSymbol name="xmark" size={14} color={COLORS.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    gap: SPACING.sm,
  },
  unread: {
    backgroundColor: '#FFF8F0',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    flexShrink: 0,
  },
  title: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: COLORS.text,
  },
  titleBold: {
    fontFamily: TYPOGRAPHY.fontFamily.openSans.semibold,
  },
  bodyText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  time: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
