import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  Snackbar,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import OTPInput from '../../components/auth/OTPInput';
import { authService } from '../../services/api';

const ForgotPasswordScreen = () => {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP states
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [otp, setOtp] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  // Validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Gửi OTP
  const handleSendOTP = async () => {
    if (!email) {
      setErrors({ email: 'Email là bắt buộc' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Email không hợp lệ' });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await authService.sendOTP({
        email,
        purpose: 'forgot-password',
      });

      setStep('otp');
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

  // Xác thực OTP
  const handleVerifyOTP = async (otpCode: string) => {
    setLoading(true);
    try {
      await authService.verifyOTP({
        email,
        otp: otpCode,
      });

      setStep('password');
      setSnackbar({
        visible: true,
        message: 'Xác thực OTP thành công',
      });
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

  // Đặt lại mật khẩu
  const handleResetPassword = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!newPassword) {
      newErrors.newPassword = 'Mật khẩu mới là bắt buộc';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await authService.resetPassword({
        email,
        newPassword,
      });

      setSnackbar({
        visible: true,
        message: 'Đặt lại mật khẩu thành công!',
      });

      // Chuyển về màn hình login sau 1.5s
      setTimeout(() => {
        router.replace('/login');
      }, 1500);
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Đặt lại mật khẩu thất bại',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              Quên mật khẩu
            </Text>

            {step === 'email' && (
              <>
                <Text variant="bodyMedium" style={styles.description}>
                  Nhập email của bạn để nhận mã OTP
                </Text>

                {/* Email */}
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  error={!!errors.email}
                  disabled={loading}
                />
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email}
                </HelperText>

                {/* Button gửi OTP */}
                <Button
                  mode="contained"
                  onPress={handleSendOTP}
                  style={styles.button}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : 'Gửi mã OTP'}
                </Button>
              </>
            )}

            {step === 'otp' && (
              <>
                {/* OTP Input */}
                <Text variant="bodyMedium" style={styles.otpText}>
                  Nhập mã OTP đã được gửi đến email: {email}
                </Text>

                <OTPInput
                  length={6}
                  onComplete={handleVerifyOTP}
                  value={otp}
                />

                {loading && <ActivityIndicator style={styles.loader} />}

                {/* Gửi lại OTP */}
                <Button
                  mode="text"
                  onPress={handleSendOTP}
                  disabled={loading}
                  style={styles.resendButton}
                >
                  Gửi lại mã OTP
                </Button>

                {/* Quay lại */}
                <Button
                  mode="text"
                  onPress={() => setStep('email')}
                  disabled={loading}
                >
                  Quay lại
                </Button>
              </>
            )}

            {step === 'password' && (
              <>
                <Text variant="bodyMedium" style={styles.description}>
                  Nhập mật khẩu mới của bạn
                </Text>

                {/* Mật khẩu mới */}
                <TextInput
                  label="Mật khẩu mới"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  style={styles.input}
                  error={!!errors.newPassword}
                  disabled={loading}
                />
                <HelperText type="error" visible={!!errors.newPassword}>
                  {errors.newPassword}
                </HelperText>

                {/* Xác nhận mật khẩu */}
                <TextInput
                  label="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  error={!!errors.confirmPassword}
                  disabled={loading}
                />
                <HelperText type="error" visible={!!errors.confirmPassword}>
                  {errors.confirmPassword}
                </HelperText>

                {/* Button đặt lại mật khẩu */}
                <Button
                  mode="contained"
                  onPress={handleResetPassword}
                  style={styles.button}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    'Đặt lại mật khẩu'
                  )}
                </Button>
              </>
            )}

            {/* Link đăng nhập */}
            <View style={styles.footer}>
              <Text>Nhớ mật khẩu? </Text>
              <Button
                mode="text"
                onPress={() => router.push('/login')}
                compact
                disabled={loading}
              >
                Đăng nhập
              </Button>
            </View>
          </Card.Content>
        </Card>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
  otpText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  loader: {
    marginVertical: 16,
  },
  resendButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});

export default ForgotPasswordScreen;
