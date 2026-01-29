import React, { useState } from 'react';
import {
  View,
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

/**
 * LoginScreen with NativeWind (Tailwind CSS) styling
 *
 * This is a refactored version showing how to use NativeWind classes
 * instead of StyleSheet for layout and spacing
 */
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

      // Lưu thông tin user và token vào AsyncStorage
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
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="p-4"
      >
        {/* Main Card - NativeWind spacing */}
        <View className="flex-1 justify-center">
          <Card className="shadow-lg">
            <Card.Content>
              {/* Title - NativeWind text styling */}
              <Text
                variant="headlineMedium"
                className="text-center mb-6 font-bold"
              >
                Đăng nhập
              </Text>

              {/* Email Input - NativeWind margin */}
              <View className="mb-1">
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!errors.email}
                  disabled={loading}
                />
              </View>
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>

              {/* Password Input - NativeWind margin */}
              <View className="mb-1">
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
                  error={!!errors.password}
                  disabled={loading}
                />
              </View>
              <HelperText type="error" visible={!!errors.password}>
                {errors.password}
              </HelperText>

              {/* Forgot Password - NativeWind alignment */}
              <View className="items-end -mt-2">
                <Button
                  mode="text"
                  onPress={() => router.push('/forgot-password')}
                  disabled={loading}
                  compact
                >
                  Quên mật khẩu?
                </Button>
              </View>

              {/* Login Button - NativeWind margin */}
              <View className="mt-4 mb-2">
                <Button
                  mode="contained"
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : 'Đăng nhập'}
                </Button>
              </View>

              {/* Register Section - NativeWind layout */}
              <View className="mt-4">
                <View className="flex-row justify-center items-center">
                  <Text>Chưa có tài khoản? </Text>
                </View>

                {/* Register Buttons - NativeWind flexbox with gap */}
                <View className="flex-row gap-2 mt-2">
                  <Button
                    mode="outlined"
                    onPress={() => router.push('/register-simple')}
                    disabled={loading}
                    className="flex-1"
                  >
                    Đơn giản
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => router.push('/register')}
                    disabled={loading}
                    className="flex-1"
                  >
                    Với OTP
                  </Button>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
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

export default LoginScreen;
