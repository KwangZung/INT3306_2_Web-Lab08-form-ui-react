/**
 * Ví dụ sử dụng:
 * 2. React hook: useState, useRef, useEffect, useCallback, useMemo
 * 4. Sử dụng redux toolkit: với username
 * 5. Tailwin Css Framework: <div className="flex items-center justify-center min-h-screen bg-gray-100">
 * 6. Sử dụng react router: 
 */


import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUsername } from "./app/userSlice";

function LoginForm() {
  const username = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const usernameRef = useRef(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setMessage(`Welcome, ${username}!`);
    },
    [username]
  );

  const isFormValid = useMemo(() => {
    return username.trim() && password.length >= 6;
  }, [username, password]);

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
        />

        <input
          type="password"
          placeholder="Password (≥6 ký tự)"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={!isFormValid}
          className={`py-2 text-lg font-semibold rounded-lg transition ${
            isFormValid
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Login
        </button>

        {message && (
          <p className="text-green-600 text-center font-medium mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}

export default LoginForm;
