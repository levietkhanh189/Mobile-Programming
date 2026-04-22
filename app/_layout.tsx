import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider as AppThemeProvider } from '@/contexts/ThemeContext';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  OpenSans_400Regular,
  OpenSans_600SemiBold,
} from '@expo-google-fonts/open-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGlassmorphismTheme } from '@/hooks/use-glassmorphism-theme';
import { connectSocket, disconnectSocket } from '../services/socket';
import { useAuthStore } from '../stores/authStore';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const token = useAuthStore((s) => s.token);

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    OpenSans_400Regular,
    OpenSans_600SemiBold,
  });

  // Get custom theme (must be called before any early returns)
  const paperTheme = useGlassmorphismTheme();

  // Manage socket connection based on auth token
  useEffect(() => {
    if (token) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }
  }, [token]);

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Don't render anything until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider>
          <PaperProvider theme={paperTheme}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
                <Stack.Screen name="forgot-password" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="products" options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="product/[id]" options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                <Stack.Screen name="payment/sepay" options={{ animation: 'slide_from_right' }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </PaperProvider>
        </AppThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
