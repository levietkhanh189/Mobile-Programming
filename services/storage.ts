import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from './api';

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
};

export const storageService = {
  // Lưu JWT token
  saveToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  },

  // Lấy JWT token
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  // Xóa JWT token
  removeToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  },

  // Lưu thông tin user
  saveUser: async (user: User): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  // Lấy thông tin user
  getUser: async (): Promise<User | null> => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  // Xóa thông tin user (logout)
  removeUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  },

  // Lưu cả user và token (sau khi login/register)
  saveAuthData: async (user: User, token: string): Promise<void> => {
    await storageService.saveUser(user);
    await storageService.saveToken(token);
  },

  // Xóa tất cả dữ liệu auth (logout)
  clearAuthData: async (): Promise<void> => {
    await storageService.removeUser();
    await storageService.removeToken();
  },

  // Kiểm tra user đã đăng nhập chưa
  isLoggedIn: async (): Promise<boolean> => {
    try {
      const token = await storageService.getToken();
      const user = await storageService.getUser();
      return token !== null && user !== null;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  },
};
