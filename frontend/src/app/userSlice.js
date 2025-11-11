// src/app/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const savedUsername = sessionStorage.getItem('username') || '';
const savedToken = sessionStorage.getItem('token') || '';

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: savedUsername,
    token: savedToken,
  },
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.token = action.payload.token;

      sessionStorage.setItem('username', action.payload.username);
      sessionStorage.setItem('token', action.payload.token);
    },

    clearUser: (state) => {
      state.username = "";
      state.token = "";

      sessionStorage.removeItem('username');
      sessionStorage.removeItem('token');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;