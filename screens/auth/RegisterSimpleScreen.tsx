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
import { authService } from '../../services/api';
import { storageService } from '../../services/storage';

const RegisterSimpleScreen = () => {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

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

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!fullName) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    }

    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Đăng ký
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authService.registerSimple({
        email,
        password,
        fullName,
        phone,
      });

      // Lưu thông tin user và token vào Realm
      if (response.user && response.token) {
        await storageService.saveAuthData(response.user, response.token);
      }

      setSnackbar({
        visible: true,
        message: 'Đăng ký thành công!',
      });

      // Chuyển về màn hình home sau 1.5s
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              Đăng ký đơn giản
            </Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              Không cần xác thực OTP
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

            {/* Họ tên */}
            <TextInput
              label="Họ và tên"
              value={fullName}
              onChangeText={setFullName}
              mode="outlined"
              style={styles.input}
              error={!!errors.fullName}
              disabled={loading}
            />
            <HelperText type="error" visible={!!errors.fullName}>
              {errors.fullName}
            </HelperText>

            {/* Số điện thoại */}
            <TextInput
              label="Số điện thoại (tùy chọn)"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              disabled={loading}
            />

            {/* Mật khẩu */}
            <TextInput
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
              error={!!errors.password}
              disabled={loading}
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>

            {/* Xác nhận mật khẩu */}
            <TextInput
              label="Xác nhận mật khẩu"
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

            {/* Button đăng ký */}
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : 'Đăng ký'}
            </Button>

            {/* Link đăng ký với OTP */}
            <View style={styles.footer}>
              <Text variant="bodySmall">Muốn bảo mật hơn? </Text>
              <Button
                mode="text"
                onPress={() => router.push('/register')}
                compact
                disabled={loading}
              >
                Đăng ký với OTP
              </Button>
            </View>

            {/* Link đăng nhập */}
            <View style={styles.footer}>
              <Text variant="bodySmall">Đã có tài khoản? </Text>
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
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});

export default RegisterSimpleScreen;
