# Hướng dẫn sử dụng Authentication App

## Tổng quan

Dự án này bao gồm:
- **Backend API**: Server Express.js với các API authentication (Register, Login, Forget Password) sử dụng OTP
- **Mobile App**: Ứng dụng React Native (Expo) với UI đẹp sử dụng React Native Paper

## Công nghệ sử dụng

### Backend
- Node.js + Express.js
- CORS, Body-parser
- In-memory storage (có thể thay thế bằng MongoDB, PostgreSQL, v.v.)

### Frontend
- React Native (Expo)
- React Native Paper (Material Design 3)
- Expo Router (File-based routing)
- AsyncStorage (Lưu trữ local)
- Axios (HTTP client)
- TypeScript

## Cài đặt và Chạy

### 1. Cài đặt Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
# Ở thư mục gốc của project
npm install
```

### 2. Chạy Backend API

```bash
cd backend
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

**Lưu ý**: OTP sẽ được in ra console của backend server vì chưa tích hợp service gửi email thật.

### 3. Chạy Mobile App

#### iOS Simulator (macOS)
```bash
npm run ios
```

#### Android Emulator
```bash
npm run android
```

#### Web
```bash
npm run web
```

#### Expo Go (Điện thoại thật)
```bash
npm start
```
Sau đó quét QR code bằng Expo Go app.

### 4. Cấu hình API Base URL

Nếu chạy trên điện thoại thật, bạn cần thay đổi `API_BASE_URL` trong file `services/api.ts`:

```typescript
// Thay localhost bằng IP của máy tính đang chạy backend
const API_BASE_URL = 'http://192.168.1.x:3000/api';
```

## Tính năng

### 1. Đăng ký đơn giản (Register Simple - No OTP)

**Luồng hoạt động:**
1. Người dùng nhập thông tin: Email, Họ tên, Số điện thoại, Mật khẩu
2. Nhấn "Đăng ký"
3. Hệ thống tạo tài khoản ngay lập tức
4. Lưu thông tin user vào AsyncStorage
5. Chuyển đến màn hình Home

**Validation:**
- Email phải hợp lệ
- Mật khẩu tối thiểu 6 ký tự
- Mật khẩu và xác nhận mật khẩu phải khớp
- Email không được trùng

**API sử dụng:**
- `POST /api/auth/register-simple` - Đăng ký trực tiếp (không OTP)

**Ưu điểm:**
- Nhanh chóng, không cần xác thực
- Phù hợp cho testing và development

**Nhược điểm:**
- Kém bảo mật hơn so với phiên bản có OTP

### 2. Đăng ký với OTP (Register with OTP)

**Luồng hoạt động:**
1. Người dùng nhập thông tin: Email, Họ tên, Số điện thoại, Mật khẩu
2. Nhấn "Gửi mã OTP"
3. Hệ thống gửi OTP đến email (hiển thị trong console backend)
4. Người dùng nhập OTP 6 số
5. Hệ thống xác thực OTP
6. Tự động đăng ký và chuyển đến màn hình Home

**Validation:**
- Email phải hợp lệ
- Mật khẩu tối thiểu 6 ký tự
- Mật khẩu và xác nhận mật khẩu phải khớp
- Email không được trùng

**API sử dụng:**
- `POST /api/auth/send-otp` - Gửi OTP
- `POST /api/auth/verify-otp` - Xác thực OTP
- `POST /api/auth/register` - Đăng ký

**Ưu điểm:**
- Bảo mật cao hơn với OTP
- Xác thực email người dùng

**Nhược điểm:**
- Mất thời gian hơn do phải nhập OTP

### 3. Đăng nhập (Login - No JWT)

**Luồng hoạt động:**
1. Người dùng nhập Email và Mật khẩu
2. Nhấn "Đăng nhập"
3. Hệ thống xác thực thông tin
4. Lưu thông tin user vào AsyncStorage
5. Chuyển đến màn hình Home

**Validation:**
- Email phải hợp lệ
- Mật khẩu không được để trống

**API sử dụng:**
- `POST /api/auth/login` - Đăng nhập

**Lưu ý:**
- Không sử dụng JWT theo yêu cầu đề bài
- Thông tin user được lưu trong AsyncStorage

### 4. Quên mật khẩu (Forgot Password with OTP)

**Luồng hoạt động:**
1. Người dùng nhập Email
2. Nhấn "Gửi mã OTP"
3. Hệ thống kiểm tra email có tồn tại không
4. Gửi OTP đến email (hiển thị trong console backend)
5. Người dùng nhập OTP 6 số
6. Hệ thống xác thực OTP
7. Người dùng nhập mật khẩu mới
8. Cập nhật mật khẩu và chuyển về màn hình Login

**Validation:**
- Email phải tồn tại trong hệ thống
- Mật khẩu mới tối thiểu 6 ký tự
- Mật khẩu mới và xác nhận phải khớp

**API sử dụng:**
- `POST /api/auth/send-otp` - Gửi OTP
- `POST /api/auth/verify-otp` - Xác thực OTP
- `POST /api/auth/reset-password` - Đặt lại mật khẩu

### 5. Màn hình Home

**Tính năng:**
- Hiển thị thông tin user: Họ tên, Email, Số điện thoại, Ngày tạo tài khoản
- Avatar với 2 chữ cái đầu của tên
- Nút đăng xuất

**Đăng xuất:**
- Xóa thông tin user khỏi AsyncStorage
- Chuyển về màn hình Login

## Cấu trúc thư mục

```
Mobile-Programming/
├── backend/                    # Backend API
│   ├── server.js              # Express server
│   ├── package.json
│   └── README.md
│
├── app/                       # App routes (Expo Router)
│   ├── _layout.tsx           # Root layout với PaperProvider
│   ├── index.tsx             # Splash screen + auth check
│   ├── login.tsx             # Route login
│   ├── register.tsx          # Route register (với OTP)
│   ├── register-simple.tsx   # Route register đơn giản (không OTP)
│   ├── forgot-password.tsx   # Route forgot password
│   └── home.tsx              # Route home
│
├── screens/                  # Screen components
│   └── auth/
│       ├── LoginScreen.tsx
│       ├── RegisterScreen.tsx         # Đăng ký với OTP
│       ├── RegisterSimpleScreen.tsx   # Đăng ký đơn giản
│       └── ForgotPasswordScreen.tsx
│
├── components/               # Reusable components
│   └── auth/
│       └── OTPInput.tsx     # OTP input component
│
├── services/                # Services
│   ├── api.ts              # API calls với axios
│   └── storage.ts          # AsyncStorage wrapper
│
└── package.json
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Authentication

#### 1. Gửi OTP
```
POST /api/auth/send-otp
Body: {
  "email": "user@example.com",
  "purpose": "register" | "forgot-password"
}
```

#### 2. Xác thực OTP
```
POST /api/auth/verify-otp
Body: {
  "email": "user@example.com",
  "otp": "123456"
}
```

#### 3. Đăng ký với OTP
```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789" (optional)
}
Lưu ý: Phải verify OTP trước
```

#### 3.5. Đăng ký đơn giản (không OTP)
```
POST /api/auth/register-simple
Body: {
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789" (optional)
}
Lưu ý: Không cần OTP, đăng ký trực tiếp
```

#### 4. Đăng nhập
```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
```

#### 5. Đặt lại mật khẩu
```
POST /api/auth/reset-password
Body: {
  "email": "user@example.com",
  "newPassword": "newpassword123"
}
```

## Test Flow

### Đăng ký đơn giản (không OTP)
1. Mở app → Màn hình Login → Nhấn "Đăng ký đơn giản"
2. Nhập thông tin:
   - Email: test@example.com
   - Họ tên: Nguyễn Văn A
   - Số điện thoại: 0123456789
   - Mật khẩu: 123456
   - Xác nhận mật khẩu: 123456
3. Nhấn "Đăng ký"
4. Tự động chuyển đến Home

### Đăng ký tài khoản mới với OTP
1. Mở app → Màn hình Login → Nhấn "Đăng ký với OTP"
2. Nhập thông tin:
   - Email: test@example.com
   - Họ tên: Nguyễn Văn A
   - Số điện thoại: 0123456789
   - Mật khẩu: 123456
   - Xác nhận mật khẩu: 123456
3. Nhấn "Gửi mã OTP"
4. Xem console backend để lấy OTP
5. Nhập OTP
6. Tự động đăng ký và chuyển đến Home

### Đăng nhập
1. Mở app → Màn hình Login
2. Nhập Email và Mật khẩu đã đăng ký
3. Nhấn "Đăng nhập"
4. Chuyển đến màn hình Home

### Quên mật khẩu
1. Màn hình Login → Nhấn "Quên mật khẩu?"
2. Nhập Email đã đăng ký
3. Nhấn "Gửi mã OTP"
4. Xem console backend để lấy OTP
5. Nhập OTP
6. Nhập mật khẩu mới
7. Nhấn "Đặt lại mật khẩu"
8. Chuyển về màn hình Login
9. Đăng nhập với mật khẩu mới

## Lưu ý quan trọng

1. **OTP trong Console**: Do chưa tích hợp service gửi email thật, OTP sẽ được in ra console của backend server.

2. **In-Memory Storage**: Dữ liệu user được lưu trong memory, sẽ mất khi restart server. Trong production nên dùng database.

3. **Password không được hash**: Mật khẩu hiện tại lưu plain text. Trong production nên hash bằng bcrypt.

4. **Không dùng JWT**: Theo yêu cầu đề bài, không sử dụng JWT. Thông tin user được lưu trong AsyncStorage.

5. **API Base URL**: Khi chạy trên điện thoại thật, cần thay đổi localhost thành IP của máy tính.

6. **OTP Expiry**: OTP có hiệu lực 5 phút.

## Mở rộng (Optional)

Để phát triển thêm, bạn có thể:

1. Tích hợp service gửi email thật (Nodemailer, SendGrid, AWS SES)
2. Sử dụng database (MongoDB, PostgreSQL, MySQL)
3. Hash password với bcrypt
4. Thêm JWT authentication
5. Thêm validation phức tạp hơn
6. Thêm rate limiting cho API
7. Thêm refresh token
8. Thêm social login (Google, Facebook)

## Troubleshooting

### Backend không chạy
- Kiểm tra port 3000 có bị chiếm không
- Chạy `npm install` trong thư mục backend

### App không kết nối được API
- Kiểm tra backend đã chạy chưa
- Kiểm tra API_BASE_URL trong `services/api.ts`
- Nếu chạy trên điện thoại thật, thay localhost bằng IP máy tính

### OTP không hiển thị
- Kiểm tra console của backend server
- OTP sẽ in ra khi gọi API send-otp

### App bị crash
- Chạy `npm install` để cài đặt dependencies
- Clear cache: `npx expo start -c`

## Hỗ trợ

Nếu có vấn đề, vui lòng:
1. Kiểm tra console backend và mobile app
2. Kiểm tra network request trong browser DevTools (nếu chạy web)
3. Đọc kỹ error message

## License

MIT

---

**Chúc bạn thành công với đồ án!** 🎉
