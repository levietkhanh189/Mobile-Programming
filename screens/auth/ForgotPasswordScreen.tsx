import React from 'react';
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
import { useForgotPasswordForm } from '../../hooks/use-forgot-password-form';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const {
    email,
    setEmail,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    otp,
    step,
    loading,
    showPassword,
    snackbar,
    setSnackbar,
    errors,
    handleSendOTP,
    handleVerifyOTP,
    handleResetPassword,
    goBackToEmail,
    currentStepIndex,
  } = useForgotPasswordForm();

  const handlePasswordResetSuccess = async () => {
    await handleResetPassword();
    // Navigate to login after success
    setTimeout(() => {
      router.push('/login');
    }, 2000);
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
              Đặt lại mật khẩu
            </Text>
            <Text
              style={{ fontFamily: 'OpenSans_400Regular' }}
              className="text-base text-white/70"
            >
              Làm theo 3 bước đơn giản
            </Text>
          </View>

          {/* Step Indicator */}
          <StepIndicator
            totalSteps={3}
            currentStep={currentStepIndex}
            labels={['Email', 'Xác thực', 'Mật khẩu mới']}
          />

          {/* Glass Form Card */}
          <GlassCard>
            {/* Step 1: Email */}
            {step === 'email' && (
              <Animated.View entering={FadeInRight.duration(400)}>
                <Text
                  style={{ fontFamily: 'OpenSans_400Regular' }}
                  className="text-white/90 text-center mb-6"
                >
                  Nhập email để nhận mã OTP xác thực
                </Text>

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

                <AnimatedButton
                  variant="cta"
                  title="Gửi mã OTP"
                  onPress={handleSendOTP}
                  loading={loading}
                  disabled={loading}
                  className="mt-4"
                />
              </Animated.View>
            )}

            {/* Step 2: OTP Verification */}
            {step === 'otp' && (
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
                      onPress={goBackToEmail}
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

            {/* Step 3: New Password */}
            {step === 'password' && (
              <Animated.View entering={FadeInRight.duration(400)}>
                <Text
                  style={{ fontFamily: 'OpenSans_400Regular' }}
                  className="text-white/90 text-center mb-6"
                >
                  Nhập mật khẩu mới của bạn
                </Text>

                <GlassTextInput
                  label="Mật khẩu mới"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  showToggle
                  error={errors.newPassword}
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
                  title="Đặt lại mật khẩu"
                  onPress={handlePasswordResetSuccess}
                  loading={loading}
                  disabled={loading}
                  className="mt-4"
                />
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

            {/* Footer Link */}
            <Text
              style={{ fontFamily: 'OpenSans_400Regular' }}
              className="text-white/70 text-center mb-3"
            >
              Nhớ mật khẩu rồi?
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

export default ForgotPasswordScreen;
