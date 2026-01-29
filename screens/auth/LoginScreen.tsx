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

const LoginScreen = () => {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

      // Lưu thông tin user và token vào Realm
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              Đăng nhập
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

            {/* Quên mật khẩu */}
            <Button
              mode="text"
              onPress={() => router.push('/forgot-password')}
              style={styles.forgotButton}
              disabled={loading}
              compact
            >
              Quên mật khẩu?
            </Button>

            {/* Button đăng nhập */}
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : 'Đăng nhập'}
            </Button>

            {/* Link đăng ký */}
            <View style={styles.footer}>
              <Text>Chưa có tài khoản? </Text>
            </View>
            <View style={styles.registerButtons}>
              <Button
                mode="outlined"
                onPress={() => router.push('/register-simple')}
                style={styles.registerButton}
                disabled={loading}
              >
                Đăng ký đơn giản
              </Button>
              <Button
                mode="contained"
                onPress={() => router.push('/register')}
                style={styles.registerButton}
                disabled={loading}
              >
                Đăng ký với OTP
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
  input: {
    marginBottom: 4,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  registerButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  registerButton: {
    flex: 1,
  },
});

export default LoginScreen;
