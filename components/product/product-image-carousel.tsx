import React, { useRef, useState } from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { COLORS } from '@/constants/theme-colors';
import ProductImageZoomModal from './product-image-zoom-modal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  images: string[];
  height?: number;
}

export default function ProductImageCarousel({ images, height = 300 }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomUri, setZoomUri] = useState('');
  const flatListRef = useRef<FlatList<string>>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const handleImagePress = (uri: string) => {
    setZoomUri(uri);
    setZoomVisible(true);
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        initialNumToRender={1}
        windowSize={3}
        removeClippedSubviews
        getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} onPress={() => handleImagePress(item)}>
            <Image
              source={{ uri: item }}
              style={[styles.image, { width: SCREEN_WIDTH, height }]}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={200}
              priority="high"
            />
          </TouchableOpacity>
        )}
      />

      {images.length > 1 && (
        <View style={styles.dotsRow}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
      )}

      <ProductImageZoomModal
        visible={zoomVisible}
        imageUri={zoomUri}
        onClose={() => setZoomVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: '#fff' },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  dotActive: { backgroundColor: COLORS.primary },
  dotInactive: { backgroundColor: COLORS.textSecondary, opacity: 0.4 },
});
