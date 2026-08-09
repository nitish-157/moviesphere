import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginRequest, registerRequest, updateProfileRequest } from "../../services/authService.js";

// Read any existing session on app load so a refresh doesn't log the user out
const storedUser = localStorage.getItem("moviesphere_user");
const storedToken = localStorage.getItem("moviesphere_token");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  loading: false,
  error: null,
};

// Thunks call the backend, then the slice persists the result to localStorage
// on success so the session survives a page refresh.
export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    return await loginRequest(credentials);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const register = createAsyncThunk("auth/register", async (formData, { rejectWithValue }) => {
  try {
    return await registerRequest(formData);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (name, { rejectWithValue }) => {
    try {
      return await updateProfileRequest(name);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Couldn't update profile");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("moviesphere_token");
      localStorage.removeItem("moviesphere_user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("moviesphere_token", action.payload.token);
        localStorage.setItem("moviesphere_user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("moviesphere_token", action.payload.token);
        localStorage.setItem("moviesphere_user", JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem("moviesphere_user", JSON.stringify(action.payload.user));
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
