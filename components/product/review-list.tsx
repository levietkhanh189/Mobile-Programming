import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

export default function ReviewList({ reviews, averageRating, totalReviews }: Props) {
  const [expanded, setExpanded] = useState(false);
  const displayed = expanded ? reviews : reviews.slice(0, 3);

  return (
    <View className="mt-4 mx-4">
      <View className="flex-row items-center mb-3">
        <Text className="text-white text-lg font-bold mr-2">Đánh giá</Text>
        <Ionicons name="star" size={16} color="#f59e0b" />
        <Text className="text-amber-400 ml-1 font-bold">{averageRating.toFixed(1)}</Text>
        <Text className="text-white/60 ml-1">({totalReviews})</Text>
      </View>
      {displayed.map(r => (
        <View key={r.id} className="bg-white/10 rounded-xl p-3 mb-2">
          <View className="flex-row items-center mb-1">
            <Text className="text-white font-semibold flex-1">{r.user?.fullName || 'Người dùng'}</Text>
            <View className="flex-row">
              {[1, 2, 3, 4, 5].map(s => (
                <Ionicons key={s} name="star" size={12} color={s <= r.rating ? '#f59e0b' : '#ffffff40'} />
              ))}
            </View>
          </View>
          {r.comment ? <Text className="text-white/80 text-sm">{r.comment}</Text> : null}
        </View>
      ))}
      {reviews.length > 3 && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text className="text-blue-400 text-center mt-1">
            {expanded ? 'Thu gọn' : `Xem tất cả ${totalReviews} đánh giá`}
          </Text>
        </TouchableOpacity>
      )}
      {reviews.length === 0 && (
        <Text className="text-white/50 text-center">Chưa có đánh giá nào</Text>
      )}
    </View>
  );
}
