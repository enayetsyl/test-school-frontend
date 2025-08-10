// src/store/auth.slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppUser } from "@/types/user";
import { setAccessToken } from "@/utils/authToken";

type AuthState = {
  user: AppUser | null;
  accessToken: string | null;
};

const initialState: AuthState = { user: null, accessToken: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AppUser; accessToken: string }>,
    ) => {
      state.user = action.payload.user;

      state.accessToken = action.payload.accessToken;
      setAccessToken(action.payload.accessToken);
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      setAccessToken(null);
    },
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;
