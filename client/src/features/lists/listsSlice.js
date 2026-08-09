import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getWatchlistRequest,
  addToWatchlistRequest,
  removeFromWatchlistRequest,
  getFavoritesRequest,
  addToFavoritesRequest,
  removeFromFavoritesRequest,
} from "../../services/userService.js";

const initialState = {
  watchlist: [], // array of TMDB movie ids
  favorites: [],
  loaded: false, // becomes true once fetchLists has run for the current session
};

// Loads both lists in parallel - called once after login / on app mount if logged in
export const fetchLists = createAsyncThunk("lists/fetchLists", async () => {
  const [watchlist, favorites] = await Promise.all([getWatchlistRequest(), getFavoritesRequest()]);
  return { watchlist, favorites };
});

export const addToWatchlist = createAsyncThunk(
  "lists/addToWatchlist",
  async (movieId, { rejectWithValue }) => {
    try {
      return await addToWatchlistRequest(movieId);
    } catch (err) {
      return rejectWithValue(movieId);
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  "lists/removeFromWatchlist",
  async (movieId, { rejectWithValue }) => {
    try {
      return await removeFromWatchlistRequest(movieId);
    } catch (err) {
      return rejectWithValue(movieId);
    }
  }
);

export const addToFavorites = createAsyncThunk(
  "lists/addToFavorites",
  async (movieId, { rejectWithValue }) => {
    try {
      return await addToFavoritesRequest(movieId);
    } catch (err) {
      return rejectWithValue(movieId);
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  "lists/removeFromFavorites",
  async (movieId, { rejectWithValue }) => {
    try {
      return await removeFromFavoritesRequest(movieId);
    } catch (err) {
      return rejectWithValue(movieId);
    }
  }
);

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    // Called on logout so the next user doesn't briefly see the previous user's lists
    resetLists: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.watchlist = action.payload.watchlist;
        state.favorites = action.payload.favorites;
        state.loaded = true;
      })

      // Watchlist - optimistic add: show it immediately, reconcile with server response,
      // roll back if the request fails
      .addCase(addToWatchlist.pending, (state, action) => {
        if (!state.watchlist.includes(action.meta.arg)) {
          state.watchlist.push(action.meta.arg);
        }
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.watchlist = action.payload;
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.watchlist = state.watchlist.filter((id) => id !== action.payload);
      })

      .addCase(removeFromWatchlist.pending, (state, action) => {
        state.watchlist = state.watchlist.filter((id) => id !== action.meta.arg);
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.watchlist = action.payload;
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        if (!state.watchlist.includes(action.payload)) {
          state.watchlist.push(action.payload);
        }
      })

      // Favorites - same optimistic pattern
      .addCase(addToFavorites.pending, (state, action) => {
        if (!state.favorites.includes(action.meta.arg)) {
          state.favorites.push(action.meta.arg);
        }
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.favorites = state.favorites.filter((id) => id !== action.payload);
      })

      .addCase(removeFromFavorites.pending, (state, action) => {
        state.favorites = state.favorites.filter((id) => id !== action.meta.arg);
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        if (!state.favorites.includes(action.payload)) {
          state.favorites.push(action.payload);
        }
      });
  },
});

export const { resetLists } = listsSlice.actions;
export default listsSlice.reducer;
