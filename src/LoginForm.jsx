/**
 * Ví dụ sử dụng:
 * 2. React hook: useState, useRef, useEffect, useCallback, useMemo
 * 4. Sử dụng redux toolkit: với username
 * 5. Tailwin Css Framework: <div className="flex items-center justify-center min-h-screen bg-gray-100">
 * 6. Sử dụng react router: Định nghĩa routes trong app.js. Thêm trang dashboard, sau khi nhấn nút login thì chuyển sang trang dashboard
 * 7. Sử dụng axios: tạo api.js, gọi api login.json khi đăng nhập để kiểm tra thông tin, nếu nhận về kết quả đúng là cho phép đăng nhập
 */


import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import api from "./api";
import { useSelector, useDispatch } from "react-redux";
import { setUsername } from "./app/userSlice";
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from "react-router-dom";

function LoginForm() {
  const username = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const usernameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const isFormValid = useMemo(() => {
    return username.trim() && password.length >= 6;
  }, [username, password]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      
      setMessage("");

      if (!isFormValid || isLoading) return;

      setIsLoading(true);

      try {
        const res = await api.get('/login.json');
        if (res.data.success) {
          dispatch(setUsername(username));
          setMessage(`Welcome, ${username}!`);
          setTimeout(() => navigate('/dashboard'), 1000);
        }
      } catch (err) {
        setError('Lỗi kết nối');
      }   finally {
        setIsLoading(false);
      }
    },
    [username, password, dispatch, navigate, isFormValid, isLoading]
  );


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>

        <input
          ref={usernameRef}
          type="text"
          placeholder="Username"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => dispatch(setUsername(e.target.value))}
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Password (≥6 ký tự)"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`py-2 text-lg font-semibold rounded-lg transition ${
            isFormValid
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {message && (
          <p className="text-green-600 text-center font-medium mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}

export default LoginForm;
