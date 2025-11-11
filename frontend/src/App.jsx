/**
 * Ví dụ sử dụng:
 * 2. React hook: useState, useRef, useEffect, useCallback, useMemo
 * 4. Sử dụng redux toolkit: với username
 * 5. Tailwin Css Framework: <div className="flex items-center justify-center min-h-screen bg-gray-100">
 * 6. Sử dụng react router: Định nghĩa routes trong app.js. Thêm trang dashboard, sau khi nhấn nút login thì chuyển sang trang dashboard
 * 7. Sử dụng axios: tạo api.js, gọi api login.json khi đăng nhập để kiểm tra thông tin, nếu nhận về kết quả đúng là cho phép đăng nhập
 */

import './App.css'

import LoginForm from './LoginForm'
import Dashboard from './Dashboard'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginForm/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
    </Routes>
  )
}

export default App
