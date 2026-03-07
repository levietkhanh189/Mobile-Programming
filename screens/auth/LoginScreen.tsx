import React, { useState, useCallback } from 'react';
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
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { GradientBackground } from '../../components/ui/gradient-background';
import { GlassCard } from '../../components/ui/glass-card';
import { GlassTextInput } from '../../components/ui/glass-text-input';
import { AnimatedButton } from '../../components/ui/animated-button';
import { authService } from '../../services/api';
import { storageService } from '../../services/storage';
import { TYPOGRAPHY } from '../../constants/theme-colors';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.login({ email, password });

      if (response.user && response.token) {
        await storageService.saveAuthData(response.user, response.token);
      }

      setSnackbar({ visible: true, message: 'Login successful!' });
      setTimeout(() => router.replace('/(tabs)'), 800);
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Login failed',
      });
    } finally {
      setLoading(false);
    }
  }, [email, password, validateForm, router]);

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
          showsVerticalScrollIndicator={false}
        >
          {/* Header with staggered animation */}
          <Animated.View
            entering={FadeInUp.duration(700).springify()}
            className="items-center mb-10"
            accessibilityRole="header"
          >
            <View className="w-20 h-20 rounded-full bg-white/15 items-center justify-center mb-5 border border-white/30">
              <Text style={{ fontSize: 36 }}>🛍️</Text>
            </View>
            <Text
              style={{ fontFamily: TYPOGRAPHY.fontFamily.poppins.bold }}
              className="text-4xl text-white mb-2 text-center"
            >
              Welcome back
            </Text>
            <Text
              style={{ fontFamily: TYPOGRAPHY.fontFamily.openSans.regular }}
              className="text-base text-white/70 text-center"
            >
              Sign in to continue shopping
            </Text>
          </Animated.View>

          {/* Glass Form Card */}
          <Animated.View entering={FadeInDown.duration(600).delay(200).springify()}>
            <GlassCard accessibilityLabel="Login form">
              <GlassTextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                disabled={loading}
                icon="email-outline"
                accessibilityHint="Enter your email address"
              />

              <GlassTextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                showToggle
                error={errors.password}
                disabled={loading}
                icon="lock-outline"
                accessibilityHint="Enter your password"
              />

              <View className="items-end mb-4 -mt-1">
                <AnimatedButton
                  variant="text"
                  title="Forgot password?"
                  onPress={() => router.push('/forgot-password')}
                  disabled={loading}
                  accessibilityHint="Navigate to password reset"
                />
              </View>

              <AnimatedButton
                variant="cta"
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                accessibilityHint="Sign in to your account"
              />

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-[1px] bg-white/20" />
                <Text
                  style={{ fontFamily: TYPOGRAPHY.fontFamily.openSans.regular }}
                  className="text-white/50 mx-4 text-sm"
                >
                  or
                </Text>
                <View className="flex-1 h-[1px] bg-white/20" />
              </View>

              <Text
                style={{ fontFamily: TYPOGRAPHY.fontFamily.openSans.regular }}
                className="text-white/70 text-center mb-3"
              >
                Don't have an account?
              </Text>
              <AnimatedButton
                variant="outline"
                title="Create Account"
                onPress={() => router.push('/register')}
                disabled={loading}
                accessibilityHint="Navigate to registration"
              />
            </GlassCard>
          </Animated.View>

          {/* Bottom spacing */}
          <View className="h-8" />
        </ScrollView>

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
