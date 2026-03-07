import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Snackbar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { authService } from '../../services/api';
import { storageService } from '../../services/storage';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/theme-colors';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email';
    if (!password) newErrors.password = 'Password is required';
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
      setSnackbar({ visible: true, message: error.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  }, [email, password, validateForm, router]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Amazon-style header bar */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>Indie Store</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Sign in</Text>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.email}
            disabled={loading}
            style={styles.input}
            outlineStyle={styles.inputOutline}
            outlineColor={COLORS.cardBorder}
            activeOutlineColor={COLORS.link}
            accessibilityLabel="Email"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            error={!!errors.password}
            disabled={loading}
            style={styles.input}
            outlineStyle={styles.inputOutline}
            outlineColor={COLORS.cardBorder}
            activeOutlineColor={COLORS.link}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            accessibilityLabel="Password"
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* Sign in button */}
          <TouchableOpacity
            style={[styles.btnYellow, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
          >
            <Text style={styles.btnYellowText}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Text>
          </TouchableOpacity>

          {/* Forgot password */}
          <TouchableOpacity
            onPress={() => router.push('/forgot-password')}
            style={styles.linkBtn}
            accessibilityLabel="Forgot password"
          >
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>New to Indie Store?</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Create account button */}
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => router.push('/register')}
            accessibilityRole="button"
            accessibilityLabel="Create account"
          >
            <Text style={styles.btnOutlineText}>Create your account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    backgroundColor: COLORS.headerBg,
    paddingTop: 50,
    paddingBottom: 14,
    alignItems: 'center',
  },
  headerLogo: {
    fontSize: 22,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.white,
  },
  scrollContent: {
    padding: SPACING.screenPadding,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text,
    marginBottom: 4,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.white,
    height: 44,
  },
  inputOutline: {
    borderRadius: 4,
    borderWidth: 1,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error,
    marginTop: 2,
  },
  btnYellow: {
    backgroundColor: COLORS.btnYellow,
    borderWidth: 1,
    borderColor: COLORS.btnYellowBorder,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  btnDisabled: { opacity: 0.6 },
  btnYellowText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  linkBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  linkText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.link,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.divider },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  btnOutlineText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
});
