import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { reviewService } from '../../services/api';

interface Props {
  productId: number;
  onSuccess: (pointsEarned: number) => void;
  alreadyReviewed?: boolean;
}

export default function ReviewForm({ productId, onSuccess, alreadyReviewed }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (alreadyReviewed) {
    return (
      <View className="mx-4 mt-3 bg-white/10 rounded-xl p-3">
        <Text className="text-white/60 text-center">&#10003; Bạn đã đánh giá sản phẩm này</Text>
      </View>
    );
  }

  const submit = async () => {
    if (rating === 0) { Alert.alert('Vui lòng chọn số sao'); return; }
    setLoading(true);
    try {
      const res = await reviewService.createReview({ productId, rating, comment: comment.trim() || undefined });
      onSuccess(res.data.pointsEarned);
      Alert.alert('Cảm ơn!', `Đánh giá thành công! +${res.data.pointsEarned} điểm`);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      Alert.alert('Lỗi', err?.response?.data?.error || 'Không thể gửi đánh giá');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mx-4 mt-4 bg-white/10 rounded-xl p-4">
      <Text className="text-white font-bold mb-3">Viết đánh giá</Text>
      <View className="flex-row mb-3">
        {[1, 2, 3, 4, 5].map(s => (
          <TouchableOpacity key={s} onPress={() => setRating(s)} className="mr-2">
            <Ionicons name="star" size={28} color={s <= rating ? '#f59e0b' : '#ffffff40'} />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Nhận xét (tuỳ chọn)..."
        placeholderTextColor="rgba(255,255,255,0.4)"
        multiline
        numberOfLines={3}
        className="text-white bg-white/10 rounded-lg p-3 mb-3"
        style={{ textAlignVertical: 'top' }}
      />
      <TouchableOpacity
        onPress={submit}
        disabled={loading}
        className="bg-blue-500 rounded-xl py-3 items-center"
      >
        <Text className="text-white font-bold">{loading ? 'Đang gửi...' : 'Gửi đánh giá'}</Text>
      </TouchableOpacity>
    </View>
  );
}
