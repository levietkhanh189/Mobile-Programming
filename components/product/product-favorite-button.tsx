import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsInWishlist, useToggleWishlist } from '../../hooks/use-wishlist';

interface Props {
  productId: number;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
}

export default function ProductFavoriteButton({
  productId,
  size = 24,
  activeColor = '#ef4444',
  inactiveColor = '#ffffff',
}: Props) {
  const isIn = useIsInWishlist(productId);
  const toggle = useToggleWishlist();

  return (
    <TouchableOpacity
      onPress={() => toggle.mutate(productId)}
      disabled={toggle.isPending}
      accessibilityLabel={isIn ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
      accessibilityRole="button"
    >
      <Ionicons
        name={isIn ? 'heart' : 'heart-outline'}
        size={size}
        color={isIn ? activeColor : inactiveColor}
      />
    </TouchableOpacity>
  );
}
