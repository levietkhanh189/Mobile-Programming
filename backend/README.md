# Backend API - Mobile Programming Project

## Cài đặt

```bash
cd backend
npm install
```

## Chạy server

### Development mode (với nodemon)
```bash
npm run dev
```

### Production mode
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## API Endpoints

### 1. Gửi OTP
**POST** `/api/auth/send-otp`

**Body:**
```json
{
  "email": "user@example.com",
  "purpose": "register" // hoặc "forgot-password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP đã được gửi đến email của bạn",
  "expiresIn": 300
}
```

### 2. Xác thực OTP
**POST** `/api/auth/verify-otp`

**Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Xác thực OTP thành công",
  "purpose": "register"
}
```

### 3. Đăng ký với OTP (Register with OTP)
**POST** `/api/auth/register`

**Lưu ý**: Phải xác thực OTP trước khi gọi endpoint này.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3.5. Đăng ký đơn giản (Register Simple - No OTP)
**POST** `/api/auth/register-simple`

**Lưu ý**: Không cần OTP, đăng ký trực tiếp.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Đăng nhập (Login)
**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Đặt lại mật khẩu (Reset Password with OTP)
**POST** `/api/auth/reset-password`

**Body:**
```json
{
  "email": "user@example.com",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đặt lại mật khẩu thành công"
}
```

### 6. Health Check
**GET** `/api/health`

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "users": 0
}
```

## Luồng sử dụng

### Đăng ký đơn giản (Register Simple - No OTP)
1. Đăng ký trực tiếp: `POST /api/auth/register-simple`

### Đăng ký với OTP (Register with OTP)
1. Gửi OTP: `POST /api/auth/send-otp` với `purpose: "register"`
2. Nhập OTP và xác thực: `POST /api/auth/verify-otp`
3. Đăng ký: `POST /api/auth/register`

### Đăng nhập (Login - No JWT)
1. Đăng nhập: `POST /api/auth/login`

### Quên mật khẩu (Forgot Password with OTP)
1. Gửi OTP: `POST /api/auth/send-otp` với `purpose: "forgot-password"`
2. Nhập OTP và xác thực: `POST /api/auth/verify-otp`
3. Đặt lại mật khẩu: `POST /api/auth/reset-password`

## Ghi chú

- OTP có hiệu lực 5 phút
- OTP sẽ được in ra console khi gửi (do chưa tích hợp email service thật)
- Mật khẩu chưa được hash (nên hash trong production)
- Dữ liệu lưu trong memory (nên dùng database trong production)
- Không sử dụng JWT theo yêu cầu của đề bài
