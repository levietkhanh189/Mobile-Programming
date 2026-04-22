import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView,
  TextInputProps, StyleSheet,
} from 'react-native';
import { userService } from '../../services/api';
import { Address } from './address-section';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialAddress?: Address;
}

interface FormState {
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  zipCode: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  address?: string;
  zipCode?: string;
}

const BLANK_FORM: FormState = {
  label: 'Nhà', fullName: '', phone: '', address: '', city: '',
  district: '', ward: '', zipCode: '',
};

const PHONE_REGEX = /^(0|\+84)[0-9]{9}$/;
const ZIP_REGEX = /^[0-9]{5,6}$/;

interface FieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
}

function Field({ label, value, onChangeText, error, ...props }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={COLORS.textMuted}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.fullName.trim() || form.fullName.trim().length < 2) {
    errors.fullName = 'Họ tên tối thiểu 2 ký tự';
  }
  if (!PHONE_REGEX.test(form.phone.trim())) {
    errors.phone = 'SĐT không hợp lệ (VD: 0901234567)';
  }
  if (!form.address.trim() || form.address.trim().length < 5) {
    errors.address = 'Địa chỉ tối thiểu 5 ký tự';
  }
  if (form.zipCode.trim() && !ZIP_REGEX.test(form.zipCode.trim())) {
    errors.zipCode = 'Mã ZIP gồm 5-6 chữ số';
  }
  return errors;
}

export default function AddressFormModal({ visible, onClose, onSuccess, initialAddress }: Props) {
  const isEdit = !!initialAddress;
  const [form, setForm] = useState<FormState>(BLANK_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialAddress) {
        setForm({
          label: initialAddress.label || 'Nhà',
          fullName: initialAddress.fullName,
          phone: initialAddress.phone,
          address: initialAddress.address,
          city: initialAddress.city,
          district: initialAddress.district || '',
          ward: initialAddress.ward || '',
          zipCode: initialAddress.zipCode || '',
        });
      } else {
        setForm(BLANK_FORM);
      }
      setErrors({});
    }
  }, [visible, initialAddress]);

  const update = (field: keyof FormState, val: string) =>
    setForm(f => ({ ...f, [field]: val }));

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const submit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!form.city.trim()) {
      setErrors({ address: 'Vui lòng nhập thành phố' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        label: form.label,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        district: form.district.trim() || undefined,
        ward: form.ward.trim() || undefined,
        zipCode: form.zipCode.trim() || undefined,
      };
      if (isEdit && initialAddress) {
        await userService.updateAddress(initialAddress.id, payload);
      } else {
        await userService.createAddress(payload);
      }
      onSuccess();
      handleClose();
    } catch {
      setErrors({ fullName: 'Không thể lưu địa chỉ, vui lòng thử lại' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{isEdit ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Field label="Nhãn" value={form.label} onChangeText={v => update('label', v)} placeholder="Nhà / Văn phòng" />
            <Field label="Họ tên *" value={form.fullName} onChangeText={v => update('fullName', v)} placeholder="Nguyễn Văn A" error={errors.fullName} />
            <Field label="Số điện thoại *" value={form.phone} onChangeText={v => update('phone', v)} placeholder="0901234567" keyboardType="phone-pad" error={errors.phone} />
            <Field label="Địa chỉ *" value={form.address} onChangeText={v => update('address', v)} placeholder="Số nhà, tên đường" error={errors.address} />
            <Field label="Phường/Xã" value={form.ward} onChangeText={v => update('ward', v)} placeholder="Phường Bến Nghé" />
            <Field label="Quận/Huyện" value={form.district} onChangeText={v => update('district', v)} placeholder="Quận 1" />
            <Field label="Thành phố *" value={form.city} onChangeText={v => update('city', v)} placeholder="TP. Hồ Chí Minh" />
            <Field label="Mã ZIP" value={form.zipCode} onChangeText={v => update('zipCode', v)} placeholder="70000" keyboardType="numeric" error={errors.zipCode} />
          </ScrollView>
          <View style={styles.btnRow}>
            <TouchableOpacity onPress={handleClose} style={[styles.btn, styles.btnCancel]} accessibilityRole="button">
              <Text style={styles.btnCancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={submit}
              disabled={loading}
              style={[styles.btn, styles.btnSubmit, loading && styles.btnDisabled]}
              accessibilityRole="button"
            >
              <Text style={styles.btnSubmitText}>{loading ? 'Đang lưu...' : 'Lưu'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: SPACING.xl,
    maxHeight: '90%',
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  field: { marginBottom: SPACING.sm },
  fieldLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
  },
  inputError: { borderColor: COLORS.error },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error,
    marginTop: 4,
  },
  btnRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  btn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  btnCancel: { borderColor: COLORS.cardBorder, backgroundColor: COLORS.white },
  btnCancelText: {
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  btnSubmit: {
    borderColor: COLORS.btnYellowBorder,
    backgroundColor: COLORS.btnYellow,
  },
  btnSubmitText: {
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  btnDisabled: { opacity: 0.6 },
});
