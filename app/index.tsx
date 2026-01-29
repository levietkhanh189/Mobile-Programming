import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { storageService } from '../services/storage';

export default function IntroScreen() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Kiểm tra xem user đã đăng nhập chưa (cần có cả token và user)
      const isLoggedIn = await storageService.isLoggedIn();

      // Delay một chút để hiển thị splash screen
      setTimeout(() => {
        if (isLoggedIn) {
          // Đã đăng nhập (có token và user), chuyển đến home
          router.replace('/home');
        } else {
          // Chưa đăng nhập, chuyển đến login
          router.replace('/login');
        }
      }, 1500);
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Nếu có lỗi, chuyển đến login
      router.replace('/login');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>🎓</Text>
        <Text style={styles.title}>Mobile Programming</Text>
        <Text style={styles.subtitle}>Authentication App</Text>
      </View>
      {isChecking && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#E0E0E0',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 16,
  },
});
