import axios from 'axios';
import { storageService } from './storage';

// Cấu hình base URL
// Production Railway API
const API_BASE_URL = 'https://backend-production-9c18.up.railway.app/api';

// Trong development local, uncomment dòng dưới:
// const API_BASE_URL = 'http://localhost:3000/api';

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
  purpose: 'register' | 'forgot-password' | 'update-email' | 'update-phone';
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
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  soldCount: number;
  discountPercentage: number;
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

export const userService = {
  updateProfile: async (data: { fullName?: string; avatar?: string }): Promise<ApiResponse<User>> => {
    try {
      const response = await api.put('/user/profile', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi khi cập nhật profile' };
    }
  },

  changePassword: async (data: { oldPassword: string; newPassword: string }): Promise<ApiResponse> => {
    try {
      const response = await api.post('/user/change-password', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi khi đổi mật khẩu' };
    }
  },

  requestUpdateEmail: async (newEmail: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/user/request-update-email', { newEmail });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi khi yêu cầu đổi email' };
    }
  },

  verifyUpdateEmail: async (newEmail: string, otp: string): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post('/user/verify-update-email', { newEmail, otp });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi khi xác thực email' };
    }
  },

  requestUpdatePhone: async (newPhone: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/user/request-update-phone', { newPhone });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi khi yêu cầu đổi SĐT' };
    }
  },

  verifyUpdatePhone: async (newPhone: string, otp: string): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post('/user/verify-update-phone', { newPhone, otp });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi khi xác thực SĐT' };
    }
  },
};

export const productService = {
  getProducts: async (search?: string, category?: string): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await api.get('/products', { params: { search, category } });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi khi lấy danh sách sản phẩm' };
    }
  },

  getProductById: async (id: number): Promise<ApiResponse<Product>> => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi khi lấy chi tiết sản phẩm' };
    }
  },

  getCategories: async (): Promise<ApiResponse<string[]>> => {
    try {
      const response = await api.get('/products/categories');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi khi lấy danh sách categories' };
    }
  },

  getTopSellers: async (limit: number = 10): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await api.get('/products/top-sellers', { params: { limit } });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi khi lấy danh sách sản phẩm bán chạy' };
    }
  },

  getDiscountedProducts: async (limit: number = 20): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await api.get('/products/discounts', { params: { limit } });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Lỗi khi lấy danh sách sản phẩm giảm giá' };
    }
  },
};

export default api;
