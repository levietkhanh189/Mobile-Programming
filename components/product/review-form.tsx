import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { reviewService } from '../../services/api';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

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
      <View style={styles.alreadyWrap}>
        <Text style={styles.alreadyText}>✓ Bạn đã đánh giá sản phẩm này</Text>
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
    <View style={styles.container}>
      <Text style={styles.title}>Viết đánh giá</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((s) => (
          <TouchableOpacity key={s} onPress={() => setRating(s)} style={styles.star}>
            <Ionicons name="star" size={28} color={s <= rating ? COLORS.star : COLORS.cardBorder} />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Nhận xét (tuỳ chọn)..."
        placeholderTextColor={COLORS.textMuted}
        multiline
        numberOfLines={3}
        style={styles.input}
      />
      <TouchableOpacity
        onPress={submit}
        disabled={loading}
        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
        accessibilityRole="button"
      >
        <Text style={styles.submitText}>{loading ? 'Đang gửi...' : 'Gửi đánh giá'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.screenPadding,
    marginTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    padding: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  starsRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  star: { marginRight: SPACING.sm },
  input: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: SPACING.sm,
  },
  submitBtn: {
    backgroundColor: COLORS.btnYellow,
    borderWidth: 1,
    borderColor: COLORS.btnYellowBorder,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
  },
  alreadyWrap: {
    marginHorizontal: SPACING.screenPadding,
    marginTop: SPACING.sm,
    backgroundColor: '#E6F5EE',
    borderWidth: 1,
    borderColor: COLORS.success,
    borderRadius: 8,
    padding: SPACING.md,
  },
  alreadyText: {
    color: COLORS.success,
    textAlign: 'center',
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
});
