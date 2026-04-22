import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { storageService } from '../services/storage';
import { COLORS, TYPOGRAPHY } from '../constants/theme-colors';

export default function IntroScreen() {
  const router = useRouter();

  const checkAuthStatus = async () => {
    try {
      const isLoggedIn = await storageService.isLoggedIn();
      setTimeout(() => {
        router.replace(isLoggedIn ? '/(tabs)' : '/login');
      }, 1500);
    } catch {
      router.replace('/login');
    }
  };

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content} accessibilityRole="header">
        <Text style={styles.logo}>Bookly</Text>
        <Text style={styles.tagline}>Đọc sách thông minh, sống tốt hơn</Text>
      </View>
      <ActivityIndicator
        size="small"
        color={COLORS.primary}
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.headerBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    marginTop: 8,
  },
  loader: {
    position: 'absolute',
    bottom: 100,
  },
});
