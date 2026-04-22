import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import { useSearchHistoryStore } from '@/stores/searchHistoryStore';

interface Props {
  onSelect: (query: string) => void;
}

export function RecentSearchesList({ onSelect }: Props) {
  const { recentSearches, removeSearch, clearAll } = useSearchHistoryStore();

  if (recentSearches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <IconSymbol name="clock" size={36} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>Chưa có lịch sử tìm kiếm</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
        <TouchableOpacity onPress={clearAll} accessibilityLabel="Xóa tất cả lịch sử">
          <Text style={styles.clearAll}>Xóa tất cả</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={recentSearches}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => onSelect(item)}
            accessibilityRole="button"
            accessibilityLabel={`Tìm kiếm ${item}`}
          >
            <IconSymbol name="magnifyingglass" size={16} color={COLORS.textMuted} />
            <Text style={styles.queryText} numberOfLines={1}>{item}</Text>
            <TouchableOpacity
              onPress={() => removeSearch(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel={`Xóa ${item}`}
            >
              <IconSymbol name="xmark" size={14} color={COLORS.textMuted} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.screenPadding,
    marginTop: SPACING.sm,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text,
  },
  clearAll: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.link,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  queryText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    gap: SPACING.sm,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
});
