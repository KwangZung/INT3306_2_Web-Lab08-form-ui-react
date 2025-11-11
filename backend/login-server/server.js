// backend/login-server/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'jwt-secret-2025-vn'; // Đổi khi deploy

app.use(cors());
app.use(express.json());

// Đường dẫn file users
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Lỗi đọc users.json:', err.message);
    return [];
  }
};

// === MIDDLEWARE: XÁC THỰC JWT ===
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token không tồn tại'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }
    req.user = user;
    next();
  });
};

// === API: ĐĂNG NHẬP ===
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu username hoặc password'
    });
  }

  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.json({
      success: false,
      message: 'Tên đăng nhập không tồn tại'
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({
      success: false,
      message: 'Mật khẩu không đúng'
    });
  }

  // TẠO JWT TOKEN
  const token = jwt.sign(
    { username: user.username, name: user.name },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    success: true,
    message: 'Đăng nhập thành công',
    token,
    expiresIn: '1h',
    data: { username: user.username, name: user.name }
  });
});

// === API: LẤY THÔNG TIN USER (BẢO VỆ BỞI JWT) ===
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Xác thực thành công',
    user: req.user
  });
});

// === TRANG CHỦ (TEST) ===
app.get('/', (req, res) => {
  res.send(`
    <h1>JWT Backend - Lab08</h1>
    <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
    <hr>
    <h3>Test với curl:</h3>
    <pre style="background:#f4f4f4;padding:10px;">
# 1. Đăng nhập
curl -X POST http://localhost:5000/api/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin","password":"123456"}'

# 2. Lấy profile (dùng token từ bước 1)
curl -X GET http://localhost:5000/api/profile \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
    </pre>
    <p><strong>User test:</strong> admin / 123456</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Backend JWT chạy tại: http://localhost:${PORT}`);
  console.log(`Mở: http://localhost:${PORT}`);
});