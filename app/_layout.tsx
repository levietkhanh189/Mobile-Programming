import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const paperTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen
            name="login"
            options={{
              headerShown: true,
              title: 'Đăng nhập',
              headerBackTitle: 'Quay lại'
            }}
          />
          <Stack.Screen
            name="register"
            options={{
              headerShown: true,
              title: 'Đăng ký với OTP',
              headerBackTitle: 'Quay lại'
            }}
          />
          <Stack.Screen
            name="register-simple"
            options={{
              headerShown: true,
              title: 'Đăng ký đơn giản',
              headerBackTitle: 'Quay lại'
            }}
          />
          <Stack.Screen
            name="forgot-password"
            options={{
              headerShown: true,
              title: 'Quên mật khẩu',
              headerBackTitle: 'Quay lại'
            }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}
