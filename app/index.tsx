import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { storageService } from '../services/storage';
import { GRADIENT_COLORS, GLASS_COLORS, TYPOGRAPHY } from '../constants/theme-colors';

export default function IntroScreen() {
  const router = useRouter();
  const pulse = useSharedValue(1);

  const checkAuthStatus = async () => {
    try {
      const isLoggedIn = await storageService.isLoggedIn();
      setTimeout(() => {
        router.replace(isLoggedIn ? '/(tabs)' : '/login');
      }, 1800);
    } catch {
      router.replace('/login');
    }
  };

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <LinearGradient
      colors={[...GRADIENT_COLORS.splash] as [string, string, ...string[]]}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.container}
    >
      <Animated.View
        entering={FadeIn.duration(800)}
        style={styles.content}
        accessibilityRole="header"
        accessibilityLabel="Indie Store, loading"
      >
        <Animated.View style={pulseStyle}>
          <View style={styles.logoCircle}>
            <Animated.Text style={styles.logoEmoji}>
              🛍️
            </Animated.Text>
          </View>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.duration(600).delay(300)}
          style={styles.title}
        >
          Indie Store
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.duration(600).delay(500)}
          style={styles.subtitle}
        >
          Shop smart, live better
        </Animated.Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(500).delay(800)}
        style={styles.loader}
      >
        <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 24,
  },
  logoEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: GLASS_COLORS.white,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    marginTop: 8,
  },
  loader: {
    position: 'absolute',
    bottom: 100,
  },
});
