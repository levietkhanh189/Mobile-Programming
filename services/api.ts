import axios from 'axios';
import { storageService } from './storage';

// Cấu hình base URL
// Trong development: http://localhost:3000
// Trong production: thay bằng URL server thật
const API_BASE_URL = 'http://localhost:3000/api';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Tự động thêm JWT token vào headers
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await storageService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token for request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Xử lý 401 errors (token hết hạn/không hợp lệ)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token hết hạn hoặc không hợp lệ -> xóa auth data
      try {
        await storageService.clearAuthData();
        // Có thể emit event để redirect về login screen
        // EventEmitter.emit('unauthorized');
      } catch (err) {
        console.error('Error clearing auth data:', err);
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface SendOTPRequest {
  email: string;
  purpose: 'register' | 'forgot-password';
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  user?: User;
  token?: string;
  expiresIn?: number;
  purpose?: string;
  remainingTime?: number;
}

// API Service
export const authService = {
  // Gửi OTP
  sendOTP: async (data: SendOTPRequest): Promise<ApiResponse> => {
    try {
      const response = await api.post('/auth/send-otp', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi kết nối server' };
    }
  },

  // Xác thực OTP
  verifyOTP: async (data: VerifyOTPRequest): Promise<ApiResponse> => {
    try {
      const response = await api.post('/auth/verify-otp', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi kết nối server' };
    }
  },

  // Đăng ký (có OTP)
  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi kết nối server' };
    }
  },

  // Đăng ký đơn giản (không OTP)
  registerSimple: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post('/auth/register-simple', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi kết nối server' };
    }
  },

  // Đăng nhập
  login: async (data: LoginRequest): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi kết nối server' };
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse> => {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi kết nối server' };
    }
  },

  // Health check
  healthCheck: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi kết nối server' };
    }
  },

  // Lấy thông tin user (yêu cầu JWT token)
  getUserProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi kết nối server' };
    }
  },
};

export default api;
