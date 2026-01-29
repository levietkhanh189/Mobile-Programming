import { useState } from 'react';
import { authService } from '../services/api';

type ForgotPasswordStep = 'email' | 'otp' | 'password';

interface UseForgotPasswordFormReturn {
  // State
  email: string;
  setEmail: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  otp: string;
  setOtp: (v: string) => void;
  step: ForgotPasswordStep;
  loading: boolean;
  showPassword: boolean;
  toggleShowPassword: () => void;
  snackbar: { visible: boolean; message: string };
  setSnackbar: (v: { visible: boolean; message: string }) => void;
  errors: Record<string, string>;
  setErrors: (v: Record<string, string>) => void;

  // Handlers
  handleSendOTP: () => Promise<void>;
  handleVerifyOTP: (otpCode: string) => Promise<void>;
  handleResetPassword: () => Promise<void>;
  goBackToEmail: () => void;

  // Computed
  currentStepIndex: number;
}

/**
 * Form state and handlers for forgot password 3-step flow
 * Steps: email -> OTP verification -> new password
 */
export function useForgotPasswordForm(): UseForgotPasswordFormReturn {
  // Form states
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  // Flow control
  const [step, setStep] = useState<ForgotPasswordStep>('email');
  const [loading, setLoading] = useState(false);

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Computed
  const currentStepIndex = step === 'email' ? 0 : step === 'otp' ? 1 : 2;

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Send OTP
  const handleSendOTP = async () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await authService.sendOTP({
        email,
        purpose: 'forgot-password',
      });

      setStep('otp');
      setSnackbar({
        visible: true,
        message: 'OTP đã được gửi đến email của bạn',
      });
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Có lỗi xảy ra',
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (otpCode: string) => {
    setLoading(true);
    try {
      await authService.verifyOTP({
        email,
        otp: otpCode,
      });

      setStep('password');
      setSnackbar({
        visible: true,
        message: 'Xác thực OTP thành công',
      });
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'OTP không chính xác',
      });
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    const newErrors: Record<string, string> = {};

    if (!newPassword) {
      newErrors.newPassword = 'Mật khẩu mới là bắt buộc';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await authService.resetPassword({
        email,
        newPassword,
      });

      setSnackbar({
        visible: true,
        message: 'Đặt lại mật khẩu thành công!',
      });
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Đặt lại mật khẩu thất bại',
      });
    } finally {
      setLoading(false);
    }
  };

  // Go back to email step
  const goBackToEmail = () => {
    setStep('email');
    setOtp('');
    setErrors({});
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return {
    email,
    setEmail,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    otp,
    setOtp,
    step,
    loading,
    showPassword,
    toggleShowPassword,
    snackbar,
    setSnackbar,
    errors,
    setErrors,
    handleSendOTP,
    handleVerifyOTP,
    handleResetPassword,
    goBackToEmail,
    currentStepIndex,
  };
}
