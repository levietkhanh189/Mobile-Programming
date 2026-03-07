import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { Portal, Dialog, TextInput, Button } from 'react-native-paper';
import { COLORS } from '@/constants/theme-colors';

export type DialogType = 'none' | 'password' | 'email' | 'phone' | 'otp-email' | 'otp-phone';

interface ProfileDialogsProps {
  dialog: { type: DialogType; visible: boolean };
  onDismiss: () => void;
  updating: boolean;
  // Password
  oldPassword: string;
  setOldPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  onChangePassword: () => void;
  // Email
  newEmail: string;
  setNewEmail: (v: string) => void;
  onRequestEmail: () => void;
  onVerifyEmail: () => void;
  // Phone
  newPhone: string;
  setNewPhone: (v: string) => void;
  onRequestPhone: () => void;
  onVerifyPhone: () => void;
  // OTP
  otp: string;
  setOtp: (v: string) => void;
}

const DIALOG_TITLES: Record<DialogType, string> = {
  none: '',
  password: 'Change Password',
  email: 'Update Email',
  'otp-email': 'Verify Email',
  phone: 'Update Phone',
  'otp-phone': 'Verify Phone',
};

export const ProfileDialogs = memo(function ProfileDialogs(props: ProfileDialogsProps) {
  const { dialog, onDismiss, updating } = props;

  return (
    <Portal>
      <Dialog
        visible={dialog.visible}
        onDismiss={() => !updating && onDismiss()}
        style={{ borderRadius: 20, backgroundColor: COLORS.white }}
      >
        <Dialog.Title style={{ fontFamily: 'Poppins_600SemiBold' }}>
          {DIALOG_TITLES[dialog.type]}
        </Dialog.Title>
        <Dialog.Content>
          {dialog.type === 'password' && (
            <View style={{ gap: 12 }}>
              <TextInput
                label="Current password"
                value={props.oldPassword}
                onChangeText={props.setOldPassword}
                secureTextEntry
                mode="outlined"
                accessibilityLabel="Current password"
              />
              <TextInput
                label="New password"
                value={props.newPassword}
                onChangeText={props.setNewPassword}
                secureTextEntry
                mode="outlined"
                accessibilityLabel="New password"
              />
            </View>
          )}
          {dialog.type === 'email' && (
            <TextInput
              label="New email"
              value={props.newEmail}
              onChangeText={props.setNewEmail}
              keyboardType="email-address"
              mode="outlined"
              accessibilityLabel="New email address"
            />
          )}
          {dialog.type === 'phone' && (
            <TextInput
              label="New phone number"
              value={props.newPhone}
              onChangeText={props.setNewPhone}
              keyboardType="phone-pad"
              mode="outlined"
              accessibilityLabel="New phone number"
            />
          )}
          {(dialog.type === 'otp-email' || dialog.type === 'otp-phone') && (
            <View style={{ gap: 12 }}>
              <Text style={{ color: COLORS.textMuted }}>
                Enter the OTP sent to {dialog.type === 'otp-email' ? props.newEmail : props.newPhone}
              </Text>
              <TextInput
                label="OTP Code"
                value={props.otp}
                onChangeText={props.setOtp}
                keyboardType="number-pad"
                mode="outlined"
                maxLength={6}
                accessibilityLabel="OTP verification code"
              />
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button disabled={updating} onPress={onDismiss}>Cancel</Button>
          {dialog.type === 'password' && <Button loading={updating} onPress={props.onChangePassword}>Update</Button>}
          {dialog.type === 'email' && <Button loading={updating} onPress={props.onRequestEmail}>Send OTP</Button>}
          {dialog.type === 'otp-email' && <Button loading={updating} onPress={props.onVerifyEmail}>Verify</Button>}
          {dialog.type === 'phone' && <Button loading={updating} onPress={props.onRequestPhone}>Send OTP</Button>}
          {dialog.type === 'otp-phone' && <Button loading={updating} onPress={props.onVerifyPhone}>Verify</Button>}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
});
