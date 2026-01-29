import { User } from './api';
import { getRealm, UserData, AuthToken } from './realm-config';

export const storageService = {
  // Lưu JWT token
  saveToken: async (token: string): Promise<void> => {
    try {
      const realm = await getRealm();
      realm.write(() => {
        // Xóa token cũ nếu có
        const existingToken = realm.objectForPrimaryKey<AuthToken>('AuthToken', 'auth_token');
        if (existingToken) {
          realm.delete(existingToken);
        }

        // Tạo token mới
        realm.create<AuthToken>('AuthToken', {
          id: 'auth_token',
          token,
          createdAt: new Date(),
        });
      });
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  },

  // Lấy JWT token
  getToken: async (): Promise<string | null> => {
    try {
      const realm = await getRealm();
      const tokenData = realm.objectForPrimaryKey<AuthToken>('AuthToken', 'auth_token');
      return tokenData ? tokenData.token : null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  // Xóa JWT token
  removeToken: async (): Promise<void> => {
    try {
      const realm = await getRealm();
      realm.write(() => {
        const tokenData = realm.objectForPrimaryKey<AuthToken>('AuthToken', 'auth_token');
        if (tokenData) {
          realm.delete(tokenData);
        }
      });
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  },

  // Lưu thông tin user
  saveUser: async (user: User): Promise<void> => {
    try {
      const realm = await getRealm();
      realm.write(() => {
        // Xóa user cũ nếu có
        const existingUser = realm.objectForPrimaryKey<UserData>('UserData', user.id);
        if (existingUser) {
          realm.delete(existingUser);
        }

        // Tạo user mới
        realm.create<UserData>('UserData', {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone || '',
          createdAt: user.createdAt,
        });
      });
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  // Lấy thông tin user
  getUser: async (): Promise<User | null> => {
    try {
      const realm = await getRealm();
      const users = realm.objects<UserData>('UserData');
      if (users.length === 0) {
        return null;
      }

      const userData = users[0];
      return {
        id: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone,
        createdAt: userData.createdAt,
      };
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  // Xóa thông tin user (logout)
  removeUser: async (): Promise<void> => {
    try {
      const realm = await getRealm();
      realm.write(() => {
        const users = realm.objects<UserData>('UserData');
        realm.delete(users);
      });
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
