import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { COLORS, SPACING } from '@/constants/theme-colors';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Banner {
  id: string;
  imageUri: string;
  title: string;
  subtitle: string;
  route?: string;
}

const BANNERS: Banner[] = [
  {
    id: '1',
    imageUri: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    title: 'Siêu Sale Hôm Nay',
    subtitle: 'Giảm đến 50% tất cả sản phẩm',
    route: '/products',
  },
  {
    id: '2',
    imageUri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    title: 'Thời Trang Mới Nhất',
    subtitle: 'Bộ sưu tập mùa hè 2024',
    route: '/products',
  },
  {
    id: '3',
    imageUri: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
    title: 'Công Nghệ Hot',
    subtitle: 'Thiết bị điện tử chính hãng',
    route: '/products',
  },
  {
    id: '4',
    imageUri: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    title: 'Freeship Toàn Quốc',
    subtitle: 'Đơn hàng từ 200k',
    route: '/products',
  },
];

const AUTO_SCROLL_INTERVAL = 4000;

export const HomeHeroBanner = () => {
  const flatListRef = useRef<FlatList<Banner>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isPaused = useRef(false);
  const currentIndex = useRef(0);

  const scrollToIndex = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
    currentIndex.current = index;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused.current) {
        const next = (currentIndex.current + 1) % BANNERS.length;
        scrollToIndex(next);
      }
    }, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(timer);
  }, [scrollToIndex]);

  const onScrollBeginDrag = useCallback(() => {
    isPaused.current = true;
  }, []);

  const onScrollEndDrag = useCallback(() => {
    isPaused.current = false;
  }, []);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      setActiveIndex(index);
      currentIndex.current = index;
    },
    []
  );

  const renderBanner = useCallback(
    ({ item }: { item: Banner }) => (
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => item.route && router.push(item.route as any)}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        <View style={styles.slide}>
          <Image source={{ uri: item.imageUri }} style={styles.image} contentFit="cover" cachePolicy="memory-disk" transition={200} priority="high" />
          <View style={styles.overlay}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={BANNERS}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />
      <View style={styles.dots}>
        {BANNERS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 24,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontFamily: 'OpenSans_400Regular',
    marginTop: 2,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
    backgroundColor: COLORS.white,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.cardBorder,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 18,
  },
});
