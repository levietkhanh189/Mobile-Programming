import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Avatar, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { storageService } from '../services/storage';
import { authService, userService, User } from '../services/api';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProfileDialogs, DialogType } from '@/components/profile/profile-dialogs';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

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
  const [dialog, setDialog] = useState<{ type: DialogType; visible: boolean }>({ type: 'none', visible: false });

  const showSnackbar = useCallback((msg: string) => setSnackbar({ visible: true, message: msg }), []);
  const closeDialog = useCallback(() => setDialog({ type: 'none', visible: false }), []);

  useEffect(() => {
    (async () => {
      try {
        const cached = await storageService.getUser();
        if (cached) { setUser(cached); setFullName(cached.fullName); }
        const res = await authService.getUserProfile();
        if (res.user) { setUser(res.user); setFullName(res.user.fullName); await storageService.saveUser(res.user); }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleUpdateProfile = useCallback(async () => {
    if (!fullName.trim()) return showSnackbar('Please enter your name');
    setUpdating(true);
    try {
      const res = await userService.updateProfile({ fullName });
      if (res.success && res.user) { setUser(res.user); await storageService.saveUser(res.user); showSnackbar('Profile updated!'); }
    } catch (e: any) { showSnackbar(e.message || 'Error'); } finally { setUpdating(false); }
  }, [fullName, showSnackbar]);

  const handleChangePassword = useCallback(async () => {
    if (!oldPassword || !newPassword) return showSnackbar('Fill all fields');
    setUpdating(true);
    try {
      const res = await userService.changePassword({ oldPassword, newPassword });
      if (res.success) { closeDialog(); showSnackbar('Password changed!'); setOldPassword(''); setNewPassword(''); }
    } catch (e: any) { showSnackbar(e.message || 'Error'); } finally { setUpdating(false); }
  }, [oldPassword, newPassword, showSnackbar, closeDialog]);

  const handleRequestEmail = useCallback(async () => {
    if (!newEmail) return showSnackbar('Enter email');
    setUpdating(true);
    try {
      const res = await userService.requestUpdateEmail(newEmail);
      if (res.success) { setDialog({ type: 'otp-email', visible: true }); showSnackbar('OTP sent'); }
    } catch (e: any) { showSnackbar(e.message || 'Error'); } finally { setUpdating(false); }
  }, [newEmail, showSnackbar]);

  const handleVerifyEmail = useCallback(async () => {
    if (!otp) return showSnackbar('Enter OTP');
    setUpdating(true);
    try {
      const res = await userService.verifyUpdateEmail(newEmail, otp);
      if (res.success && res.user) { setUser(res.user); await storageService.saveUser(res.user); closeDialog(); showSnackbar('Email updated!'); setOtp(''); }
    } catch (e: any) { showSnackbar(e.message || 'Invalid OTP'); } finally { setUpdating(false); }
  }, [newEmail, otp, showSnackbar, closeDialog]);

  const handleRequestPhone = useCallback(async () => {
    if (!newPhone) return showSnackbar('Enter phone');
    setUpdating(true);
    try {
      const res = await userService.requestUpdatePhone(newPhone);
      if (res.success) { setDialog({ type: 'otp-phone', visible: true }); showSnackbar('OTP sent'); }
    } catch (e: any) { showSnackbar(e.message || 'Error'); } finally { setUpdating(false); }
  }, [newPhone, showSnackbar]);

  const handleVerifyPhone = useCallback(async () => {
    if (!otp) return showSnackbar('Enter OTP');
    setUpdating(true);
    try {
      const res = await userService.verifyUpdatePhone(newPhone, otp);
      if (res.success && res.user) { setUser(res.user); await storageService.saveUser(res.user); closeDialog(); showSnackbar('Phone updated!'); setOtp(''); }
    } catch (e: any) { showSnackbar(e.message || 'Invalid OTP'); } finally { setUpdating(false); }
  }, [newPhone, otp, showSnackbar, closeDialog]);

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <IconSymbol name="chevron.left" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Account</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <Avatar.Text size={72} label={user?.fullName?.substring(0, 2).toUpperCase() || 'U'} style={{ backgroundColor: COLORS.headerBg }} />
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TextInput value={fullName} onChangeText={setFullName} mode="outlined" label="Full Name"
            style={styles.input} outlineStyle={{ borderRadius: 4 }} accessibilityLabel="Full name" />
          <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateProfile} disabled={updating}>
            <Text style={styles.saveBtnText}>{updating && dialog.type === 'none' ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Login & Security</Text>
          {[
            { title: 'Password', sub: 'Change your password', onPress: () => setDialog({ type: 'password', visible: true }) },
            { title: 'Email', sub: user?.email || '', onPress: () => { setNewEmail(user?.email || ''); setDialog({ type: 'email', visible: true }); } },
            { title: 'Phone', sub: user?.phone || 'Not linked', onPress: () => { setNewPhone(user?.phone || ''); setDialog({ type: 'phone', visible: true }); } },
          ].map((item) => (
            <TouchableOpacity key={item.title} style={styles.menuItem} onPress={item.onPress} accessibilityRole="button">
              <View style={{ flex: 1 }}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSub} numberOfLines={1}>{item.sub}</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ProfileDialogs dialog={dialog} onDismiss={closeDialog} updating={updating}
        oldPassword={oldPassword} setOldPassword={setOldPassword}
        newPassword={newPassword} setNewPassword={setNewPassword} onChangePassword={handleChangePassword}
        newEmail={newEmail} setNewEmail={setNewEmail} onRequestEmail={handleRequestEmail} onVerifyEmail={handleVerifyEmail}
        newPhone={newPhone} setNewPhone={setNewPhone} onRequestPhone={handleRequestPhone} onVerifyPhone={handleVerifyPhone}
        otp={otp} setOtp={setOtp}
      />
      <Snackbar visible={snackbar.visible} onDismiss={() => setSnackbar({ ...snackbar, visible: false })} duration={3000}>{snackbar.message}</Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding, paddingTop: 50, paddingBottom: 12,
    backgroundColor: COLORS.headerBg,
  },
  headerTitle: { fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold, color: COLORS.white },
  scroll: { paddingBottom: 40 },
  avatarSection: { alignItems: 'center', paddingVertical: SPACING.xl, backgroundColor: COLORS.white, marginBottom: SPACING.sm },
  userName: { fontSize: TYPOGRAPHY.fontSize.xl, fontFamily: TYPOGRAPHY.fontFamily.poppins.bold, color: COLORS.text, marginTop: SPACING.sm },
  userEmail: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, marginTop: 2 },
  section: { backgroundColor: COLORS.white, marginHorizontal: SPACING.screenPadding, marginTop: SPACING.md, borderRadius: 4, borderWidth: 1, borderColor: COLORS.cardBorder, padding: SPACING.md },
  sectionTitle: { fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold, color: COLORS.text, marginBottom: SPACING.sm },
  input: { backgroundColor: COLORS.white, marginBottom: SPACING.md },
  saveBtn: { backgroundColor: COLORS.btnYellow, borderWidth: 1, borderColor: COLORS.btnYellowBorder, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  saveBtnText: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium, color: COLORS.text },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  menuTitle: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium, color: COLORS.text },
  menuSub: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, marginTop: 2 },
});
