import { createSlice } from "@reduxjs/toolkit";

// Default to the user's OS preference if they haven't chosen yet
const getInitialTheme = () => {
  const stored = localStorage.getItem("moviesphere_theme");
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const initialState = {
  mode: getInitialTheme(), // "dark" | "light"
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("moviesphere_theme", state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
