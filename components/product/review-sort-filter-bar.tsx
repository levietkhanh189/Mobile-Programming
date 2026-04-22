import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Chip, Menu, Button } from 'react-native-paper';
import { COLORS } from '@/constants/theme-colors';

export type SortOption = 'newest' | 'oldest' | 'high' | 'low';

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Mới nhất',
  oldest: 'Cũ nhất',
  high: 'Sao cao → thấp',
  low: 'Sao thấp → cao',
};

const STAR_FILTERS = [0, 5, 4, 3, 2, 1] as const;
const STAR_LABEL = (s: number) => (s === 0 ? 'Tất cả' : `${s}★`);

interface Props {
  sort: SortOption;
  starFilter: number;
  onSortChange: (s: SortOption) => void;
  onStarFilterChange: (s: number) => void;
}

export default function ReviewSortFilterBar({ sort, starFilter, onSortChange, onStarFilterChange }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            compact
            textColor={COLORS.text}
            style={styles.sortButton}
            onPress={() => setMenuVisible(true)}
          >
            {SORT_LABELS[sort]}
          </Button>
        }
      >
        {(Object.keys(SORT_LABELS) as SortOption[]).map(opt => (
          <Menu.Item
            key={opt}
            title={SORT_LABELS[opt]}
            onPress={() => { onSortChange(opt); setMenuVisible(false); }}
          />
        ))}
      </Menu>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {STAR_FILTERS.map(s => (
          <Chip
            key={s}
            selected={starFilter === s}
            onPress={() => onStarFilterChange(s)}
            style={[styles.chip, starFilter === s && styles.chipActive]}
            textStyle={starFilter === s ? styles.chipTextActive : styles.chipText}
            compact
          >
            {STAR_LABEL(s)}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 },
  sortButton: { borderColor: COLORS.cardBorder, marginRight: 8 },
  chips: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  chip: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.cardBorder },
  chipActive: { backgroundColor: '#f59e0b', borderColor: '#f59e0b' },
  chipText: { color: COLORS.textSecondary, fontSize: 12 },
  chipTextActive: { color: COLORS.text, fontSize: 12, fontWeight: 'bold' },
});
