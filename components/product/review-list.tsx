import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReviewRatingBreakdown from './review-rating-breakdown';
import ReviewSortFilterBar, { SortOption } from './review-sort-filter-bar';

interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: { fullName: string };
}

interface Props {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const PAGE_SIZE = 10;

export default function ReviewList({ reviews, averageRating, totalReviews }: Props) {
  const [sort, setSort] = useState<SortOption>('newest');
  const [starFilter, setStarFilter] = useState(0);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = starFilter === 0 ? reviews : reviews.filter(r => Math.round(r.rating) === starFilter);
    switch (sort) {
      case 'oldest': list = [...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt)); break;
      case 'high':   list = [...list].sort((a, b) => b.rating - a.rating); break;
      case 'low':    list = [...list].sort((a, b) => a.rating - b.rating); break;
      default:       list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
    }
    return list;
  }, [reviews, sort, starFilter]);

  const displayed = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = displayed.length < filtered.length;

  const handleSortChange = (s: SortOption) => { setSort(s); setPage(1); };
  const handleStarChange = (s: number) => { setStarFilter(s); setPage(1); };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đánh giá</Text>
      <ReviewRatingBreakdown reviews={reviews} />
      <ReviewSortFilterBar
        sort={sort}
        starFilter={starFilter}
        onSortChange={handleSortChange}
        onStarFilterChange={handleStarChange}
      />
      {displayed.length === 0 ? (
        <Text style={styles.empty}>Không có đánh giá nào</Text>
      ) : (
        displayed.map(r => <ReviewItem key={r.id} review={r} />)
      )}
      {hasMore && (
        <TouchableOpacity style={styles.moreBtn} onPress={() => setPage(p => p + 1)}>
          <Text style={styles.moreText}>Xem thêm ({filtered.length - displayed.length})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function ReviewItem({ review: r }: { review: Review }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.userName}>{r.user?.fullName || 'Người dùng'}</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map(s => (
            <Ionicons key={s} name="star" size={12} color={s <= r.rating ? '#f59e0b' : 'rgba(255,255,255,0.25)'} />
          ))}
        </View>
      </View>
      {r.comment ? <Text style={styles.comment}>{r.comment}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16, marginHorizontal: 16 },
  title: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, marginBottom: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  userName: { color: '#ffffff', fontWeight: '600', flex: 1 },
  stars: { flexDirection: 'row' },
  comment: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  empty: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 12 },
  moreBtn: { marginTop: 8, paddingVertical: 10, alignItems: 'center' },
  moreText: { color: '#60a5fa', fontSize: 14 },
});
