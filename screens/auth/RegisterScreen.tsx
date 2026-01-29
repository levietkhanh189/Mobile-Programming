import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { GradientBackground } from '../../components/ui/gradient-background';
import { GlassCard } from '../../components/ui/glass-card';
import { GlassTextInput } from '../../components/ui/glass-text-input';
import { AnimatedButton } from '../../components/ui/animated-button';
import { StepIndicator } from '../../components/ui/step-indicator';
import OTPInput from '../../components/auth/OTPInput';
import { authService } from '../../services/api';
import { storageService } from '../../services/storage';
import { useRegisterForm } from '../../hooks/use-register-form';

const RegisterScreen = () => {
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

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  // Current step for indicator
  const currentStep = otpSent ? 1 : 0;

  // Send OTP
  const handleSendOTP = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await authService.sendOTP({
        email,
        purpose: 'register',
      });

      setOtpSent(true);
      setSnackbar({
        visible: true,
        message: 'OTP đã được gửi đến email của bạn',
      });
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Có lỗi xảy ra',
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (otpCode: string) => {
    setLoading(true);
    try {
      await authService.verifyOTP({
        email,
        otp: otpCode,
      });

      setSnackbar({
        visible: true,
        message: 'Xác thực OTP thành công',
      });

      // Auto-register after OTP verification
      await handleRegister();
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'OTP không chính xác',
      });
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  // Register
  const handleRegister = async () => {
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
          <View className="items-center mb-6">
            <Text
              style={{ fontFamily: 'Poppins_700Bold' }}
              className="text-4xl text-white mb-2"
            >
              Tạo tài khoản
            </Text>
            <Text
              style={{ fontFamily: 'OpenSans_400Regular' }}
              className="text-base text-white/70"
            >
              Đăng ký với xác thực OTP
            </Text>
          </View>

          {/* Step Indicator */}
          <StepIndicator
            totalSteps={2}
            currentStep={currentStep}
            labels={['Chi tiết', 'Xác thực']}
          />

          {/* Glass Form Card */}
          <GlassCard>
            {!otpSent ? (
              <Animated.View entering={FadeInRight.duration(400)}>
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
                  title="Gửi mã OTP"
                  onPress={handleSendOTP}
                  loading={loading}
                  disabled={loading}
                  className="mt-4"
                />
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInLeft.duration(400)}>
                <Text
                  style={{ fontFamily: 'OpenSans_400Regular' }}
                  className="text-white/90 text-center mb-4"
                >
                  Nhập mã OTP đã được gửi đến email:
                </Text>
                <Text
                  style={{ fontFamily: 'Poppins_600SemiBold' }}
                  className="text-white text-center mb-6"
                >
                  {email}
                </Text>

                <OTPInput length={6} onComplete={handleVerifyOTP} value={otp} />

                <View className="flex-row gap-3 mt-4">
                  <View className="flex-1">
                    <AnimatedButton
                      variant="text"
                      title="Quay lại"
                      onPress={() => setOtpSent(false)}
                      disabled={loading}
                    />
                  </View>
                  <View className="flex-1">
                    <AnimatedButton
                      variant="text"
                      title="Gửi lại OTP"
                      onPress={handleSendOTP}
                      disabled={loading}
                    />
                  </View>
                </View>
              </Animated.View>
            )}

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
            <Text
              style={{ fontFamily: 'OpenSans_400Regular' }}
              className="text-white/70 text-center mb-3"
            >
              Đã có tài khoản?
            </Text>
            <AnimatedButton
              variant="outline"
              title="Đăng nhập"
              onPress={() => router.push('/login')}
              disabled={loading}
            />
          </GlassCard>
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

export default RegisterScreen;
