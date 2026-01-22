const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage (trong thực tế nên dùng database)
const users = [];
const otpStore = {}; // { email: { otp, expiresAt, purpose } }

// Helper function: Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function: Send OTP (giả lập gửi email)
function sendOTPEmail(email, otp, purpose) {
  console.log(`\n========================================`);
  console.log(`📧 Gửi OTP đến email: ${email}`);
  console.log(`🔑 Mã OTP: ${otp}`);
  console.log(`📝 Mục đích: ${purpose}`);
  console.log(`⏰ Hiệu lực: 5 phút`);
  console.log(`========================================\n`);

  // Trong thực tế, sử dụng nodemailer hoặc service gửi SMS
  // Ví dụ với nodemailer:
  // const transporter = nodemailer.createTransport({...});
  // await transporter.sendMail({...});
}

// Helper function: Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function: Find user by email
function findUserByEmail(email) {
  return users.find(user => user.email === email);
}

// ==================== AUTH ENDPOINTS ====================

// 1. Gửi OTP
app.post('/api/auth/send-otp', (req, res) => {
  try {
    const { email, purpose } = req.body;

    // Validate
    if (!email || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Email và purpose là bắt buộc'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    // Kiểm tra purpose
    const validPurposes = ['register', 'forgot-password'];
    if (!validPurposes.includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: 'Purpose không hợp lệ (register hoặc forgot-password)'
      });
    }

    // Nếu purpose là register, kiểm tra email đã tồn tại chưa
    if (purpose === 'register') {
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được đăng ký'
        });
      }
    }

    // Nếu purpose là forgot-password, kiểm tra email có tồn tại không
    if (purpose === 'forgot-password') {
      const user = findUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Email không tồn tại trong hệ thống'
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 phút

    // Store OTP
    otpStore[email] = {
      otp,
      expiresAt,
      purpose,
      verified: false
    };

    // Send OTP
    sendOTPEmail(email, otp, purpose);

    res.json({
      success: true,
      message: 'OTP đã được gửi đến email của bạn',
      expiresIn: 300 // seconds
    });

  } catch (error) {
    console.error('Error in send-otp:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// 2. Xác thực OTP
app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email và OTP là bắt buộc'
      });
    }

    // Kiểm tra OTP có tồn tại không
    const storedOTP = otpStore[email];
    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: 'OTP không tồn tại hoặc đã hết hạn'
      });
    }

    // Kiểm tra OTP đã hết hạn chưa
    if (Date.now() > storedOTP.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({
        success: false,
        message: 'OTP đã hết hạn'
      });
    }

    // Kiểm tra OTP có đúng không
    if (storedOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP không chính xác'
      });
    }

    // Đánh dấu OTP đã được xác thực
    otpStore[email].verified = true;

    res.json({
      success: true,
      message: 'Xác thực OTP thành công',
      purpose: storedOTP.purpose
    });

  } catch (error) {
    console.error('Error in verify-otp:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// 3. Đăng ký (có OTP)
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    // Validate
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password và fullName là bắt buộc'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Kiểm tra email đã được đăng ký chưa
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được đăng ký'
      });
    }

    // Kiểm tra OTP đã được xác thực chưa
    const storedOTP = otpStore[email];
    if (!storedOTP || !storedOTP.verified || storedOTP.purpose !== 'register') {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng xác thực OTP trước khi đăng ký'
      });
    }

    // Tạo user mới
    const newUser = {
      id: users.length + 1,
      email,
      password, // Trong thực tế nên hash password
      fullName,
      phone: phone || '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Xóa OTP đã sử dụng
    delete otpStore[email];

    // Return user info (không trả về password)
    const { password: _, ...userInfo } = newUser;

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      user: userInfo
    });

  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// 3.5. Đăng ký đơn giản (không dùng OTP)
app.post('/api/auth/register-simple', (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    // Validate
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password và fullName là bắt buộc'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Kiểm tra email đã được đăng ký chưa
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được đăng ký'
      });
    }

    // Tạo user mới (không cần OTP)
    const newUser = {
      id: users.length + 1,
      email,
      password, // Trong thực tế nên hash password
      fullName,
      phone: phone || '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Return user info (không trả về password)
    const { password: _, ...userInfo } = newUser;

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      user: userInfo
    });

  } catch (error) {
    console.error('Error in register-simple:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// 4. Đăng nhập (không dùng JWT theo yêu cầu)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và password là bắt buộc'
      });
    }

    // Tìm user
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    // Kiểm tra password
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    // Return user info (không trả về password)
    const { password: _, ...userInfo } = user;

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: userInfo
    });

  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// 5. Quên mật khẩu (gửi OTP)
// Endpoint này đã được xử lý trong send-otp với purpose='forgot-password'

// 6. Đặt lại mật khẩu
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email và newPassword là bắt buộc'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }

    // Kiểm tra OTP đã được xác thực chưa
    const storedOTP = otpStore[email];
    if (!storedOTP || !storedOTP.verified || storedOTP.purpose !== 'forgot-password') {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng xác thực OTP trước khi đặt lại mật khẩu'
      });
    }

    // Tìm user
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email không tồn tại trong hệ thống'
      });
    }

    // Cập nhật mật khẩu
    user.password = newPassword; // Trong thực tế nên hash password

    // Xóa OTP đã sử dụng
    delete otpStore[email];

    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công'
    });

  } catch (error) {
    console.error('Error in reset-password:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    users: users.length
  });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`\n🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   - POST /api/auth/send-otp - Gửi OTP`);
  console.log(`   - POST /api/auth/verify-otp - Xác thực OTP`);
  console.log(`   - POST /api/auth/register - Đăng ký (có OTP)`);
  console.log(`   - POST /api/auth/register-simple - Đăng ký đơn giản (không OTP)`);
  console.log(`   - POST /api/auth/login - Đăng nhập (không JWT)`);
  console.log(`   - POST /api/auth/reset-password - Đặt lại mật khẩu`);
  console.log(`   - GET  /api/health - Health check\n`);
});
