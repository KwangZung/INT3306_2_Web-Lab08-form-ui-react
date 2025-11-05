import React from 'react';
import { useSelector } from 'react-redux';

function Dashboard() {
  const username = useSelector((state) => state.user.username);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Dashboard, {username || "お客様"}!</h1>
    </div>
  );
}

export default Dashboard;