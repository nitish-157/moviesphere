import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import themeReducer from "../features/theme/themeSlice.js";
import listsReducer from "../features/lists/listsSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    lists: listsReducer,
  },
});
