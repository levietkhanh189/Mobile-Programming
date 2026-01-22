# Mobile Programming - Authentication App

Ứng dụng React Native với đầy đủ tính năng authentication: Register (có/không OTP), Login (không JWT), Forgot Password (có OTP).

## 🚀 Quick Start

### 1. Chạy Backend API
```bash
cd backend
npm install
npm run dev
```
Server: `http://localhost:3000`

### 2. Chạy Mobile App
```bash
npm install
npm start
```

## 📱 Tính năng chính

### ✅ Đăng ký đơn giản (Register Simple - No OTP)
- Đăng ký nhanh chóng, không cần xác thực
- Phù hợp cho testing và development
- Route: `/register-simple`
- API: `POST /api/auth/register-simple`

### 🔐 Đăng ký với OTP (Register with OTP)
- Bảo mật cao với xác thực OTP qua email
- OTP hiệu lực 5 phút
- Route: `/register`
- API:
  - `POST /api/auth/send-otp`
  - `POST /api/auth/verify-otp`
  - `POST /api/auth/register`

### 🔑 Đăng nhập (Login - No JWT)
- Không sử dụng JWT (theo yêu cầu)
- Lưu user info trong AsyncStorage
- Route: `/login`
- API: `POST /api/auth/login`

### 🔄 Quên mật khẩu (Forgot Password with OTP)
- Xác thực OTP trước khi đổi mật khẩu
- Route: `/forgot-password`
- API:
  - `POST /api/auth/send-otp`
  - `POST /api/auth/verify-otp`
  - `POST /api/auth/reset-password`

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- CORS, Body-parser
- In-memory storage

### Frontend
- React Native (Expo)
- React Native Paper (Material Design 3)
- Expo Router (File-based routing)
- AsyncStorage
- Axios
- TypeScript

## 📖 Chi tiết

Xem file `AUTHENTICATION_GUIDE.md` để biết:
- Hướng dẫn cài đặt chi tiết
- API documentation đầy đủ
- Test flow từng tính năng
- Troubleshooting

## 🎯 Test nhanh

### Đăng ký đơn giản
1. Mở app → Login → "Đăng ký đơn giản"
2. Nhập thông tin → "Đăng ký"
3. ✅ Done!

### Đăng ký với OTP
1. Mở app → Login → "Đăng ký với OTP"
2. Nhập thông tin → "Gửi mã OTP"
3. **Xem OTP trong console backend**
4. Nhập OTP → Tự động đăng ký
5. ✅ Done!

### Login
1. Nhập email/password
2. "Đăng nhập"
3. ✅ Done!

## ⚠️ Lưu ý

- **OTP**: Hiển thị trong console backend (chưa tích hợp email thật)
- **JWT**: Không sử dụng (theo yêu cầu)
- **Password**: Chưa hash (production nên dùng bcrypt)
- **Storage**: In-memory (production nên dùng database)
- **API URL**: Khi chạy trên thiết bị thật, đổi `localhost` thành IP máy tính trong `services/api.ts`

## 📂 Cấu trúc dự án

```
Mobile-Programming/
├── backend/                    # Backend API
│   ├── server.js
│   └── README.md
│
├── app/                        # Routes (Expo Router)
│   ├── login.tsx
│   ├── register.tsx            # Với OTP
│   ├── register-simple.tsx     # Không OTP
│   ├── forgot-password.tsx
│   └── home.tsx
│
├── screens/auth/               # Screen components
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── RegisterSimpleScreen.tsx
│   └── ForgotPasswordScreen.tsx
│
├── services/                   # API & Storage
│   ├── api.ts
│   └── storage.ts
│
└── components/auth/            # Components
    └── OTPInput.tsx
```

## 🌟 Highlights

✅ 2 cách đăng ký: Đơn giản (nhanh) và OTP (bảo mật)
✅ Login không dùng JWT
✅ OTP cho Register và Forgot Password
✅ UI đẹp với Material Design 3
✅ TypeScript
✅ Validation đầy đủ
✅ Error handling tốt
✅ Responsive design

---

**Chúc bạn code vui vẻ!** 🎉
