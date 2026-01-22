import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from './api';

const USER_KEY = '@user_data';

export const storageService = {
  // Lưu thông tin user
  saveUser: async (user: User): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  // Lấy thông tin user
  getUser: async (): Promise<User | null> => {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  // Xóa thông tin user (logout)
  removeUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  },

  // Kiểm tra user đã đăng nhập chưa
  isLoggedIn: async (): Promise<boolean> => {
    try {
      const user = await AsyncStorage.getItem(USER_KEY);
      return user !== null;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  },
};
