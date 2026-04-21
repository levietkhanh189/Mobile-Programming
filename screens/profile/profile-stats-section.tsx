import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { userService } from '../../services/api';
import PointsCard from '../../components/profile/points-card';
import SpendingStats from '../../components/profile/spending-stats';
import AddressSection, { Address } from '../../components/profile/address-section';
import AddressFormModal from '../../components/profile/address-form-modal';

interface StatGroup {
  count: number;
  total: number;
}

interface Stats {
  delivered: StatGroup;
  pending: StatGroup;
  cancelled: StatGroup;
  totalSpent: number;
  totalOrders: number;
}

interface Props {
  points: number;
  stats: Stats | null;
  addresses: Address[];
  onAddressesChange: () => void;
}

export default function ProfileStatsSection({ points, stats, addresses, onAddressesChange }: Props) {
  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await userService.deleteAddress(id);
      onAddressesChange();
    } catch {
      Alert.alert('Lỗi', 'Không thể xóa địa chỉ');
    }
  }, [onAddressesChange]);

  const handleSetDefault = useCallback(async (id: number) => {
    try {
      await userService.setDefaultAddress(id);
      onAddressesChange();
    } catch {
      Alert.alert('Lỗi', 'Không thể đặt địa chỉ mặc định');
    }
  }, [onAddressesChange]);

  return (
    <>
      <PointsCard points={points} />
      {stats && <SpendingStats stats={stats} />}
      <AddressSection
        addresses={addresses}
        onAdd={() => setShowAddressModal(true)}
        onDelete={handleDelete}
        onSetDefault={handleSetDefault}
      />
      <AddressFormModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSuccess={onAddressesChange}
      />
    </>
  );
}
