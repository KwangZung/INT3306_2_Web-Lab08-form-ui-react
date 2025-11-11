// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from './api';

function Dashboard() {
  const username = useSelector((state) => state.user?.username || "Khách");

  if (!username) {
    return <Navigate to="/login" replace />;
  }

  const token = useSelector((state) => state.user?.token || "");

  const [tokenStatus, setTokenStatus] = useState("Đang kiểm tra token...");

  useEffect(() => {
    if (!token) {
      setTokenStatus("Token không hợp lệ (không có token)");
      return;
    }

    api.get('/api/profile')
      .then(res => {
        if (res.data.success) {
          setTokenStatus("Token hợp lệ");
        } else {
          setTokenStatus("Token không hợp lệ");
        }
      })
      .catch(() => {
        setTokenStatus("Token không hợp lệ");
      });
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      <div className="bg-white/95 backdrop-blur-sm p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full">
        
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Welcome to Dashboard, <span className="text-indigo-600">{username}</span>!
        </h1>

        <div className="mt-8 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
          <p className="text-lg font-medium text-gray-700 mb-2">
            Trạng thái Token:
          </p>
          <p className={`text-2xl font-bold ${
            tokenStatus.includes("không") || tokenStatus.includes("Đang") 
              ? "text-red-600" 
              : "text-green-600"
          }`}>
            {tokenStatus}
          </p>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Current time: November 11, 2025 04:12 PM +07</p>
          <p>Country: VN</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;