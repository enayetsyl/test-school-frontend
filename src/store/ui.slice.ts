// src/store/ui.slice.ts
import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "ui",
  initialState: { globalLoading: false },
  reducers: {
    startLoading: (s) => {
      s.globalLoading = true;
    },
    stopLoading: (s) => {
      s.globalLoading = false;
    },
  },
});
export const { startLoading, stopLoading } = slice.actions;
export default slice.reducer;
