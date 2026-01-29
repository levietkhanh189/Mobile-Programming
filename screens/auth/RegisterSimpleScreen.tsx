import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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
import { useRegisterForm } from '../../hooks/use-register-form';

const RegisterSimpleScreen = () => {
  const router = useRouter();
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fullName,
    setFullName,
    phone,
    setPhone,
    showPassword,
    errors,
    validateForm,
  } = useRegisterForm();

  // UI states
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  // Direct register (no OTP)
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        email,
        password,
        fullName,
        phone,
      });

      if (response.user && response.token) {
        await storageService.saveAuthData(response.user, response.token);
      }

      setSnackbar({
        visible: true,
        message: 'Đăng ký thành công!',
      });

      setTimeout(() => {
        router.replace('/home');
      }, 1500);
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Đăng ký thất bại',
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
              Đăng ký nhanh
            </Text>
            <Text
              style={{ fontFamily: 'OpenSans_400Regular' }}
              className="text-base text-white/70"
            >
              Không cần xác thực OTP
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
                label="Họ và tên"
                value={fullName}
                onChangeText={setFullName}
                error={errors.fullName}
                disabled={loading}
                icon="account-outline"
              />

              <GlassTextInput
                label="Số điện thoại (tùy chọn)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                disabled={loading}
                icon="phone-outline"
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

              <GlassTextInput
                label="Xác nhận mật khẩu"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                error={errors.confirmPassword}
                disabled={loading}
                icon="lock-check-outline"
              />

              <AnimatedButton
                variant="cta"
                title="Đăng ký"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                className="mt-4"
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

              {/* Footer Links */}
              <View className="gap-3">
                <AnimatedButton
                  variant="outline"
                  title="Đăng ký với OTP"
                  onPress={() => router.push('/register')}
                  disabled={loading}
                />

                <AnimatedButton
                  variant="text"
                  title="Đã có tài khoản? Đăng nhập"
                  onPress={() => router.push('/login')}
                  disabled={loading}
                />
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

export default RegisterSimpleScreen;
