import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Button, TextInput, Avatar, ActivityIndicator, Snackbar, Appbar, Portal, Dialog, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { storageService } from '../services/storage';
import { authService, userService, User } from '../services/api';

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

    // Form states
    const [fullName, setFullName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [otp, setOtp] = useState('');

    // Dialog states
    const [dialog, setDialog] = useState<{ type: 'none' | 'password' | 'email' | 'phone' | 'otp-email' | 'otp-phone'; visible: boolean }>({
        type: 'none',
        visible: false,
    });

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const cachedUser = await storageService.getUser();
            if (cachedUser) {
                setUser(cachedUser);
                setFullName(cachedUser.fullName);
            }

            const response = await authService.getUserProfile();
            if (response.user) {
                setUser(response.user);
                setFullName(response.user.fullName);
                await storageService.saveUser(response.user);
            }
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message: string) => {
        setSnackbar({ visible: true, message });
    };

    const handleUpdateProfile = async () => {
        if (!fullName.trim()) return showSnackbar('Vui lòng nhập họ tên');

        setUpdating(true);
        try {
            const response = await userService.updateProfile({ fullName });
            if (response.success && response.user) {
                setUser(response.user);
                await storageService.saveUser(response.user);
                showSnackbar('Cập nhật thông tin thành công!');
            }
        } catch (error: any) {
            showSnackbar(error.message || 'Lỗi cập nhật profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) return showSnackbar('Vui lòng nhập đủ mật khẩu');

        setUpdating(true);
        try {
            const response = await userService.changePassword({ oldPassword, newPassword });
            if (response.success) {
                setDialog({ type: 'none', visible: false });
                showSnackbar('Đổi mật khẩu thành công!');
                setOldPassword('');
                setNewPassword('');
            }
        } catch (error: any) {
            showSnackbar(error.message || 'Lỗi đổi mật khẩu');
        } finally {
            setUpdating(false);
        }
    };

    const handleRequestUpdateEmail = async () => {
        if (!newEmail) return showSnackbar('Vui lòng nhập email mới');

        setUpdating(true);
        try {
            const response = await userService.requestUpdateEmail(newEmail);
            if (response.success) {
                setDialog({ type: 'otp-email', visible: true });
                showSnackbar('Đã gửi mã OTP đến email mới');
            }
        } catch (error: any) {
            showSnackbar(error.message || 'Lỗi yêu cầu đổi email');
        } finally {
            setUpdating(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (!otp) return showSnackbar('Vui lòng nhập mã OTP');

        setUpdating(true);
        try {
            const response = await userService.verifyUpdateEmail(newEmail, otp);
            if (response.success && response.user) {
                setUser(response.user);
                await storageService.saveUser(response.user);
                setDialog({ type: 'none', visible: false });
                showSnackbar('Cập nhật email thành công!');
                setOtp('');
            }
        } catch (error: any) {
            showSnackbar(error.message || 'Mã OTP không chính xác');
        } finally {
            setUpdating(false);
        }
    };

    const handleRequestUpdatePhone = async () => {
        if (!newPhone) return showSnackbar('Vui lòng nhập SĐT mới');

        setUpdating(true);
        try {
            const response = await userService.requestUpdatePhone(newPhone);
            if (response.success) {
                setDialog({ type: 'otp-phone', visible: true });
                showSnackbar('Đã gửi mã OTP (giả lập) thành công');
            }
        } catch (error: any) {
            showSnackbar(error.message || 'Lỗi yêu cầu đổi SĐT');
        } finally {
            setUpdating(false);
        }
    };

    const handleVerifyPhone = async () => {
        if (!otp) return showSnackbar('Vui lòng nhập mã OTP');

        setUpdating(true);
        try {
            const response = await userService.verifyUpdatePhone(newPhone, otp);
            if (response.success && response.user) {
                setUser(response.user);
                await storageService.saveUser(response.user);
                setDialog({ type: 'none', visible: false });
                showSnackbar('Cập nhật SĐT thành công!');
                setOtp('');
            }
        } catch (error: any) {
            showSnackbar(error.message || 'Mã OTP không chính xác');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Tài khoản của tôi" />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={() => showSnackbar('Tính năng upload ảnh đang phát triển')}>
                        <Avatar.Text
                            size={100}
                            label={user?.fullName?.substring(0, 2).toUpperCase() || 'U'}
                            style={styles.avatar}
                        />
                        <View style={styles.editIconContainer}>
                            <Avatar.Icon size={30} icon="camera" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Họ và tên</Text>
                    <TextInput
                        value={fullName}
                        onChangeText={setFullName}
                        mode="outlined"
                        placeholder="Nhập họ tên"
                        style={styles.input}
                    />

                    <Button
                        mode="contained"
                        onPress={handleUpdateProfile}
                        loading={updating && dialog.type === 'none'}
                        disabled={updating}
                        style={styles.mainButton}
                    >
                        Lưu thay đổi
                    </Button>

                    <Divider style={styles.divider} />

                    <Text style={styles.sectionTitle}>Bảo mật & Liên kết</Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => setDialog({ type: 'password', visible: true })}
                    >
                        <View>
                            <Text style={styles.menuItemTitle}>Đổi mật khẩu</Text>
                            <Text style={styles.menuItemSub}>Thay đổi mật khẩu đăng nhập</Text>
                        </View>
                        <Avatar.Icon size={30} icon="chevron-right" style={{ backgroundColor: 'transparent' }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            setNewEmail(user?.email || '');
                            setDialog({ type: 'email', visible: true });
                        }}
                    >
                        <View>
                            <Text style={styles.menuItemTitle}>Email</Text>
                            <Text style={styles.menuItemSub}>{user?.email}</Text>
                        </View>
                        <Avatar.Icon size={30} icon="chevron-right" style={{ backgroundColor: 'transparent' }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            setNewPhone(user?.phone || '');
                            setDialog({ type: 'phone', visible: true });
                        }}
                    >
                        <View>
                            <Text style={styles.menuItemTitle}>Số điện thoại</Text>
                            <Text style={styles.menuItemSub}>{user?.phone || 'Chưa liên kết'}</Text>
                        </View>
                        <Avatar.Icon size={30} icon="chevron-right" style={{ backgroundColor: 'transparent' }} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Dialogs */}
            <Portal>
                <Dialog visible={dialog.visible} onDismiss={() => !updating && setDialog({ ...dialog, visible: false })}>
                    <Dialog.Title>
                        {dialog.type === 'password' && 'Đổi mật khẩu'}
                        {dialog.type === 'email' && 'Cập nhật Email'}
                        {dialog.type === 'otp-email' && 'Xác thực Email'}
                        {dialog.type === 'phone' && 'Cập nhật SĐT'}
                        {dialog.type === 'otp-phone' && 'Xác thực SĐT'}
                    </Dialog.Title>
                    <Dialog.Content>
                        {dialog.type === 'password' && (
                            <View>
                                <TextInput
                                    label="Mật khẩu cũ"
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                    secureTextEntry
                                    mode="outlined"
                                    style={{ marginBottom: 12 }}
                                />
                                <TextInput
                                    label="Mật khẩu mới"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry
                                    mode="outlined"
                                />
                            </View>
                        )}
                        {(dialog.type === 'email' || dialog.type === 'password') && dialog.type === 'email' && (
                            <TextInput
                                label="Email mới"
                                value={newEmail}
                                onChangeText={setNewEmail}
                                keyboardType="email-address"
                                mode="outlined"
                            />
                        )}
                        {dialog.type === 'phone' && (
                            <TextInput
                                label="Số điện thoại mới"
                                value={newPhone}
                                onChangeText={setNewPhone}
                                keyboardType="phone-pad"
                                mode="outlined"
                            />
                        )}
                        {(dialog.type === 'otp-email' || dialog.type === 'otp-phone') && (
                            <View>
                                <Text style={{ marginBottom: 16 }}>Vui lòng nhập mã OTP đã được gửi đến {dialog.type === 'otp-email' ? newEmail : newPhone}</Text>
                                <TextInput
                                    label="Mã OTP"
                                    value={otp}
                                    onChangeText={setOtp}
                                    keyboardType="number-pad"
                                    mode="outlined"
                                    maxLength={6}
                                />
                            </View>
                        )}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button disabled={updating} onPress={() => setDialog({ ...dialog, visible: false })}>Hủy</Button>
                        {dialog.type === 'password' && <Button loading={updating} onPress={handleChangePassword}>Cập nhật</Button>}
                        {dialog.type === 'email' && <Button loading={updating} onPress={handleRequestUpdateEmail}>Gửi OTP</Button>}
                        {dialog.type === 'otp-email' && <Button loading={updating} onPress={handleVerifyEmail}>Xác nhận</Button>}
                        {dialog.type === 'phone' && <Button loading={updating} onPress={handleRequestUpdatePhone}>Gửi OTP</Button>}
                        {dialog.type === 'otp-phone' && <Button loading={updating} onPress={handleVerifyPhone}>Xác nhận</Button>}
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Snackbar
                visible={snackbar.visible}
                onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
                duration={3000}
            >
                {snackbar.message}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#FFF',
    },
    avatar: {
        backgroundColor: '#6200ee',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    formSection: {
        padding: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        marginBottom: 20,
        backgroundColor: '#FFF',
    },
    mainButton: {
        paddingVertical: 4,
        borderRadius: 8,
    },
    divider: {
        marginVertical: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    menuItemSub: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
});
