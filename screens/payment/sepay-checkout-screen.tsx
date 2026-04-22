import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ActivityIndicator,
  TouchableOpacity, Alert,
} from 'react-native';
import { WebView, type WebViewMessageEvent, type WebViewNavigation } from 'react-native-webview';
import { router, useLocalSearchParams } from 'expo-router';
import { paymentService, type SepayCheckoutFields } from '@/services/api';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Build a tiny HTML page that auto-submits SePay fields via hidden form.
// SePay redirects back to our backend /api/payments/sepay/return which posts
// a message to this WebView (see backend controller.handleReturn).
function buildAutoSubmitHtml(actionUrl: string, fields: SepayCheckoutFields): string {
  const inputs = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(
      ([k, v]) =>
        `<input type="hidden" name="${escapeHtml(k)}" value="${escapeHtml(String(v))}" />`,
    )
    .join('');
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Redirecting to SePay...</title>
<style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;color:#333}</style>
</head><body>
<div>Đang chuyển đến cổng SePay...</div>
<form id="f" method="POST" action="${escapeHtml(actionUrl)}" accept-charset="UTF-8">
${inputs}
</form>
<script>document.getElementById('f').submit();</script>
</body></html>`;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type PayStatus = 'idle' | 'loading' | 'ready' | 'paid' | 'failed' | 'cancelled' | 'error';

export default function SepayCheckoutScreen() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = typeof params.orderId === 'string' ? params.orderId : '';

  const [status, setStatus] = useState<PayStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [html, setHtml] = useState<string>('');
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Create checkout on mount.
  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      setErrorMsg('Thiếu orderId');
      return;
    }
    setStatus('loading');
    paymentService.createSepayCheckout(orderId)
      .then((res) => {
        if (!res.success) throw new Error('Không tạo được phiên thanh toán');
        setHtml(buildAutoSubmitHtml(res.actionUrl, res.fields));
        setStatus('ready');
      })
      .catch((err: any) => {
        setStatus('error');
        setErrorMsg(err?.message || 'Lỗi tạo thanh toán');
      });
  }, [orderId]);

  // Poll order status every 3s while ready — catches webhook-driven PAID.
  useEffect(() => {
    if (status !== 'ready' || !orderId) return;
    pollTimer.current = setInterval(async () => {
      try {
        const r = await paymentService.getSepayStatus(orderId);
        if (r.sepayStatus === 'PAID') {
          setStatus('paid');
        } else if (r.sepayStatus === 'CANCELLED') {
          setStatus('cancelled');
        } else if (r.sepayStatus === 'FAILED') {
          setStatus('failed');
        }
      } catch { /* ignore transient errors */ }
    }, 3000);
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
      pollTimer.current = null;
    };
  }, [status, orderId]);

  // React to terminal states: navigate away.
  useEffect(() => {
    if (status === 'paid') {
      Alert.alert('Thanh toán thành công', 'Cảm ơn bạn đã mua hàng!', [
        { text: 'Xem đơn hàng', onPress: () => router.replace('/(tabs)/orders' as any) },
      ]);
    } else if (status === 'cancelled') {
      Alert.alert('Đã hủy', 'Bạn đã hủy giao dịch thanh toán.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else if (status === 'failed') {
      Alert.alert('Thanh toán thất bại', 'Giao dịch không thành công. Vui lòng thử lại.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  }, [status]);

  const onMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data?.type === 'sepay_return') {
        // Backend return endpoint tells us success/error/cancel from query param.
        if (data.status === 'success') setStatus('paid');
        else if (data.status === 'cancel') setStatus('cancelled');
        else if (data.status === 'error') setStatus('failed');
      }
    } catch { /* non-json message — ignore */ }
  }, []);

  // Fallback: inspect navigation URL directly for return endpoint (some WebViews
  // may not execute our script before navigation settles).
  const onNavigationStateChange = useCallback((nav: WebViewNavigation) => {
    const url = nav.url || '';
    if (url.includes('/api/payments/sepay/return')) {
      if (url.includes('status=success')) setStatus('paid');
      else if (url.includes('status=cancel')) setStatus('cancelled');
      else if (url.includes('status=error')) setStatus('failed');
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button">
          <IconSymbol name="chevron.left" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán SePay</Text>
        <View style={styles.backBtn} />
      </View>

      {status === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang chuẩn bị thanh toán...</Text>
        </View>
      )}

      {status === 'error' && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
            <Text style={styles.retryText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'ready' && html.length > 0 && (
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          onMessage={onMessage}
          onNavigationStateChange={onNavigationStateChange}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          style={styles.webview}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  webview: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xxl },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  errorText: {
    color: COLORS.error,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  retryBtn: {
    backgroundColor: COLORS.btnYellow,
    borderWidth: 1,
    borderColor: COLORS.btnYellowBorder,
    borderRadius: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  retryText: {
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
});
