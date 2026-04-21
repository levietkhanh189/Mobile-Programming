import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, TextInputProps } from 'react-native';
import { userService } from '../../services/api';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

const INITIAL_FORM: FormState = { label: 'Nhà', fullName: '', phone: '', address: '', city: '' };

interface FieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
}

function Field({ label, value, onChangeText, ...props }: FieldProps) {
  return (
    <View className="mb-3">
      <Text className="text-white/70 text-sm mb-1">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        className="bg-white/10 text-white rounded-xl px-4 py-3"
        placeholderTextColor="rgba(255,255,255,0.3)"
        {...props}
      />
    </View>
  );
}

export default function AddressFormModal({ visible, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof FormState, val: string) =>
    setForm(f => ({ ...f, [field]: val }));

  const handleClose = () => {
    setForm(INITIAL_FORM);
    onClose();
  };

  const submit = async () => {
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim()) {
      Alert.alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setLoading(true);
    try {
      await userService.createAddress(form);
      onSuccess();
      handleClose();
    } catch {
      Alert.alert('Lỗi', 'Không thể thêm địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-slate-900 rounded-t-3xl p-6" style={{ maxHeight: '85%' }}>
          <Text className="text-white text-lg font-bold mb-4">Thêm địa chỉ</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Field label="Nhãn" value={form.label} onChangeText={v => update('label', v)} placeholder="Nhà / Văn phòng" />
            <Field label="Họ tên" value={form.fullName} onChangeText={v => update('fullName', v)} placeholder="Nguyễn Văn A" />
            <Field label="Số điện thoại" value={form.phone} onChangeText={v => update('phone', v)} placeholder="0901234567" keyboardType="phone-pad" />
            <Field label="Địa chỉ" value={form.address} onChangeText={v => update('address', v)} placeholder="123 Đường ABC, Phường XYZ" />
            <Field label="Thành phố" value={form.city} onChangeText={v => update('city', v)} placeholder="TP. Hồ Chí Minh" />
          </ScrollView>
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 border border-white/20 rounded-xl py-3 items-center"
            >
              <Text className="text-white">Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={submit}
              disabled={loading}
              className="flex-1 bg-blue-500 rounded-xl py-3 items-center"
            >
              <Text className="text-white font-bold">{loading ? 'Đang lưu...' : 'Lưu'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
