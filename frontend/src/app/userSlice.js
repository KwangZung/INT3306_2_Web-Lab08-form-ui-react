import { createSlice } from "@reduxjs/toolkit";

const savedUsername = sessionStorage.getItem('username') || '';

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: savedUsername,
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
      sessionStorage.setItem('username', action.payload);
    },
    clearUsername: (state) => {
      state.username = "";
      sessionStorage.removeItem('username');
    },
  },
});

export const { setUsername, clearUsername } = userSlice.actions;
export default userSlice.reducer;
