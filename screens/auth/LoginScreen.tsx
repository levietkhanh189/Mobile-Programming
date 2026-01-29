import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Snackbar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GradientBackground } from '../../components/ui/gradient-background';
import { GlassCard } from '../../components/ui/glass-card';
import { GlassTextInput } from '../../components/ui/glass-text-input';
import { AnimatedButton } from '../../components/ui/animated-button';
import { authService } from '../../services/api';
import { storageService } from '../../services/storage';

const LoginScreen = () => {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  // Validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Đăng nhập
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({
        email,
        password,
      });

      // Lưu thông tin user và token vào storage
      if (response.user && response.token) {
        await storageService.saveAuthData(response.user, response.token);
      }

      setSnackbar({
        visible: true,
        message: 'Đăng nhập thành công!',
      });

      // Chuyển về màn hình home sau 1s
      setTimeout(() => {
        router.replace('/home');
      }, 1000);
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Đăng nhập thất bại',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-6"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="items-center mb-8">
            <Text
              style={{ fontFamily: 'Poppins_700Bold' }}
              className="text-4xl text-white mb-2"
            >
              Chào mừng trở lại
            </Text>
            <Text
              style={{ fontFamily: 'OpenSans_400Regular' }}
              className="text-base text-white/70"
            >
              Đăng nhập để tiếp tục
            </Text>
          </View>

          {/* Glass Form Card */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <GlassCard>
              <GlassTextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                disabled={loading}
                icon="email-outline"
              />

              <GlassTextInput
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                showToggle
                error={errors.password}
                disabled={loading}
                icon="lock-outline"
              />

              {/* Forgot password link */}
              <View className="items-end mb-4 -mt-2">
                <AnimatedButton
                  variant="text"
                  title="Quên mật khẩu?"
                  onPress={() => router.push('/forgot-password')}
                  disabled={loading}
                />
              </View>

              {/* Login button */}
              <AnimatedButton
                variant="cta"
                title="Đăng nhập"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
              />

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-[1px] bg-white/20" />
                <Text
                  style={{ fontFamily: 'OpenSans_400Regular' }}
                  className="text-white/50 mx-4"
                >
                  hoặc
                </Text>
                <View className="flex-1 h-[1px] bg-white/20" />
              </View>

              {/* Register options */}
              <Text
                style={{ fontFamily: 'OpenSans_400Regular' }}
                className="text-white/70 text-center mb-3"
              >
                Chưa có tài khoản?
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <AnimatedButton
                    variant="outline"
                    title="Đăng ký đơn giản"
                    onPress={() => router.push('/register-simple')}
                    disabled={loading}
                  />
                </View>
                <View className="flex-1">
                  <AnimatedButton
                    variant="primary"
                    title="Đăng ký với OTP"
                    onPress={() => router.push('/register')}
                    disabled={loading}
                  />
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        </ScrollView>

        {/* Snackbar */}
        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
          duration={3000}
        >
          {snackbar.message}
        </Snackbar>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

export default LoginScreen;
