// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Đọc file users.json
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Lỗi đọc file users.json:', err);
    return [];
  }
};

// API: POST /api/login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập username và password'
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

  // So sánh mật khẩu
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.json({
      success: false,
      message: 'Mật khẩu không đúng'
    });
  }

  // Đăng nhập thành công
  res.json({
    success: true,
    message: 'Đăng nhập thành công!',
    data: {
      username: user.username,
      name: user.name
    }
  });
});

// Test route
app.get('/', (req, res) => {
  res.send(`
    <h1>Login Server đang chạy!</h1>
    <p>Dùng POST /api/login để đăng nhập</p>
    <hr>
    <h3>Ví dụ với curl:</h3>
    <pre>
curl -X POST http://localhost:5000/api/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin","password":"123456"}'
    </pre>
  `);
});

app.listen(PORT, () => {
  console.log(`Server chạy tại: http://localhost:${PORT}`);
  console.log(`Test login: curl -X POST http://localhost:${PORT}/api/login -d '{"username":"admin","password":"123456"}' -H "Content-Type: application/json"`);
});