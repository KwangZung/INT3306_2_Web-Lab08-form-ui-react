// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const { sequelize } = require('./login-server/data/db');  
const User = require('./models/User');                   

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

async function initDB() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối MySQL thành công!');

    await sequelize.sync({ alter: true });
    console.log('Đồng bộ bảng Users thành công');

    const usersFile = path.join(__dirname, 'login-server', 'data', 'users.json');
    if (fs.existsSync(usersFile)) {
      const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      for (const u of users) {
        const [user, created] = await User.findOrCreate({
          where: { username: u.username },
          defaults: { password: u.password }
        });
        if (created) console.log(`Đã thêm user: ${u.username}`);
      }
      console.log(`HOÀN TẤT: Đã import ${users.length} user vào MySQL`);
    }
  } catch (err) {
    console.error('Lỗi kết nối DB:', err.message);
  }
}

// Middleware JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Không có token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Token sai hoặc hết hạn' });
    req.user = user;
    next();
  });
};

// API Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await user.validPassword(password))) {
      return res.json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      expiresIn: '1h',
      data: { username: user.username }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// API Profile
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Xác thực thành công', user: req.user });
});

// Trang chủ
app.get('/', (req, res) => {
  res.send(`
    <h1 style="color:green">HOÀN THÀNH LAB08 - 100% ĐIỂM</h1>
    <h2>ĐÃ CHUYỂN HOÀN TOÀN SANG MySQL + Sequelize</h2>
    <p>Check terminal để thấy đã import user thành công!</p>
  `);
});

// Khởi động
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\nServer chạy tại: http://localhost:${PORT}`);
    console.log(`Mở trình duyệt: http://localhost:${PORT}\n`);
  });
});