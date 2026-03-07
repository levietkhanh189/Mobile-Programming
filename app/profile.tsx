import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Avatar, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { storageService } from '../services/storage';
import { authService, userService, User } from '../services/api';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProfileDialogs, DialogType } from '@/components/profile/profile-dialogs';
import { GLASS_COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [fullName, setFullName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [dialog, setDialog] = useState<{ type: DialogType; visible: boolean }>({
    type: 'none', visible: false,
  });

  const showSnackbar = useCallback((message: string) => {
    setSnackbar({ visible: true, message });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog({ type: 'none', visible: false });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const cached = await storageService.getUser();
        if (cached) { setUser(cached); setFullName(cached.fullName); }
        const res = await authService.getUserProfile();
        if (res.user) { setUser(res.user); setFullName(res.user.fullName); await storageService.saveUser(res.user); }
      } catch (e) { console.error('Error loading user:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleUpdateProfile = useCallback(async () => {
    if (!fullName.trim()) return showSnackbar('Please enter your name');
    setUpdating(true);
    try {
      const res = await userService.updateProfile({ fullName });
      if (res.success && res.user) { setUser(res.user); await storageService.saveUser(res.user); showSnackbar('Profile updated!'); }
    } catch (e: any) { showSnackbar(e.message || 'Error updating profile'); }
    finally { setUpdating(false); }
  }, [fullName, showSnackbar]);

  const handleChangePassword = useCallback(async () => {
    if (!oldPassword || !newPassword) return showSnackbar('Please fill all fields');
    setUpdating(true);
    try {
      const res = await userService.changePassword({ oldPassword, newPassword });
      if (res.success) { closeDialog(); showSnackbar('Password changed!'); setOldPassword(''); setNewPassword(''); }
    } catch (e: any) { showSnackbar(e.message || 'Error changing password'); }
    finally { setUpdating(false); }
  }, [oldPassword, newPassword, showSnackbar, closeDialog]);

  const handleRequestEmail = useCallback(async () => {
    if (!newEmail) return showSnackbar('Please enter email');
    setUpdating(true);
    try {
      const res = await userService.requestUpdateEmail(newEmail);
      if (res.success) { setDialog({ type: 'otp-email', visible: true }); showSnackbar('OTP sent to new email'); }
    } catch (e: any) { showSnackbar(e.message || 'Error'); }
    finally { setUpdating(false); }
  }, [newEmail, showSnackbar]);

  const handleVerifyEmail = useCallback(async () => {
    if (!otp) return showSnackbar('Please enter OTP');
    setUpdating(true);
    try {
      const res = await userService.verifyUpdateEmail(newEmail, otp);
      if (res.success && res.user) { setUser(res.user); await storageService.saveUser(res.user); closeDialog(); showSnackbar('Email updated!'); setOtp(''); }
    } catch (e: any) { showSnackbar(e.message || 'Invalid OTP'); }
    finally { setUpdating(false); }
  }, [newEmail, otp, showSnackbar, closeDialog]);

  const handleRequestPhone = useCallback(async () => {
    if (!newPhone) return showSnackbar('Please enter phone');
    setUpdating(true);
    try {
      const res = await userService.requestUpdatePhone(newPhone);
      if (res.success) { setDialog({ type: 'otp-phone', visible: true }); showSnackbar('OTP sent'); }
    } catch (e: any) { showSnackbar(e.message || 'Error'); }
    finally { setUpdating(false); }
  }, [newPhone, showSnackbar]);

  const handleVerifyPhone = useCallback(async () => {
    if (!otp) return showSnackbar('Please enter OTP');
    setUpdating(true);
    try {
      const res = await userService.verifyUpdatePhone(newPhone, otp);
      if (res.success && res.user) { setUser(res.user); await storageService.saveUser(res.user); closeDialog(); showSnackbar('Phone updated!'); setOtp(''); }
    } catch (e: any) { showSnackbar(e.message || 'Invalid OTP'); }
    finally { setUpdating(false); }
  }, [newPhone, otp, showSnackbar, closeDialog]);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={GLASS_COLORS.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Go back">
          <IconSymbol name="chevron.left" size={22} color={GLASS_COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar section */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.avatarSection}>
          <Avatar.Text
            size={88}
            label={user?.fullName?.substring(0, 2).toUpperCase() || 'U'}
            style={{ backgroundColor: GLASS_COLORS.primary }}
          />
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </Animated.View>

        {/* Edit name */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            mode="outlined"
            label="Full Name"
            style={styles.input}
            outlineStyle={{ borderRadius: 14 }}
            accessibilityLabel="Full name"
          />
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleUpdateProfile}
            disabled={updating}
            accessibilityRole="button"
          >
            <Text style={styles.saveBtnText}>
              {updating && dialog.type === 'none' ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Security menu */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Links</Text>
          {[
            { title: 'Change Password', sub: 'Update your login password', type: 'password' as DialogType, onPress: () => setDialog({ type: 'password', visible: true }) },
            { title: 'Email', sub: user?.email || '', type: 'email' as DialogType, onPress: () => { setNewEmail(user?.email || ''); setDialog({ type: 'email', visible: true }); } },
            { title: 'Phone', sub: user?.phone || 'Not linked', type: 'phone' as DialogType, onPress: () => { setNewPhone(user?.phone || ''); setDialog({ type: 'phone', visible: true }); } },
          ].map((item) => (
            <TouchableOpacity
              key={item.type}
              style={styles.menuItem}
              onPress={item.onPress}
              accessibilityRole="button"
              accessibilityLabel={item.title}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSub} numberOfLines={1}>{item.sub}</Text>
              </View>
              <IconSymbol name="chevron.right" size={18} color={GLASS_COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </Animated.View>
        <View style={{ height: 40 }} />
      </ScrollView>

      <ProfileDialogs
        dialog={dialog}
        onDismiss={closeDialog}
        updating={updating}
        oldPassword={oldPassword} setOldPassword={setOldPassword}
        newPassword={newPassword} setNewPassword={setNewPassword}
        onChangePassword={handleChangePassword}
        newEmail={newEmail} setNewEmail={setNewEmail}
        onRequestEmail={handleRequestEmail} onVerifyEmail={handleVerifyEmail}
        newPhone={newPhone} setNewPhone={setNewPhone}
        onRequestPhone={handleRequestPhone} onVerifyPhone={handleVerifyPhone}
        otp={otp} setOtp={setOtp}
      />

      <Snackbar visible={snackbar.visible} onDismiss={() => setSnackbar({ ...snackbar, visible: false })} duration={3000}>
        {snackbar.message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GLASS_COLORS.backgroundDark },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: GLASS_COLORS.white, ...SHADOWS.sm,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: GLASS_COLORS.text,
  },
  scrollContent: { paddingBottom: 40 },
  avatarSection: {
    alignItems: 'center', paddingVertical: SPACING.lg,
    backgroundColor: GLASS_COLORS.white, marginBottom: SPACING.sm,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.xl, fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: GLASS_COLORS.text, marginTop: SPACING.sm,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.fontSize.sm, color: GLASS_COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular, marginTop: 2,
  },
  section: {
    backgroundColor: GLASS_COLORS.white, marginHorizontal: SPACING.md,
    marginTop: SPACING.md, borderRadius: 20, padding: SPACING.md, ...SHADOWS.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: GLASS_COLORS.text, marginBottom: SPACING.sm,
  },
  input: { backgroundColor: GLASS_COLORS.backgroundDark, marginBottom: SPACING.sm },
  saveBtn: {
    backgroundColor: GLASS_COLORS.primary, paddingVertical: 14, borderRadius: 14,
    alignItems: 'center', ...SHADOWS.md,
  },
  saveBtnText: {
    color: GLASS_COLORS.white, fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: GLASS_COLORS.backgroundDark,
    padding: SPACING.md, borderRadius: 14, marginBottom: SPACING.sm,
  },
  menuTitle: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: GLASS_COLORS.text,
  },
  menuSub: {
    fontSize: TYPOGRAPHY.fontSize.xs, color: GLASS_COLORS.textMuted, marginTop: 2,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
});
