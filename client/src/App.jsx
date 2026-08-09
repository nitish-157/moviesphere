import { useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { fetchLists } from "./features/lists/listsSlice.js";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import PageLoader from "./components/PageLoader.jsx";

// Route-based code splitting - each page is its own JS chunk, downloaded
// only when the person navigates there instead of all up front.
const Home = lazy(() => import("./pages/Home.jsx"));
const MovieDetails = lazy(() => import("./pages/MovieDetails.jsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.jsx"));
const Genre = lazy(() => import("./pages/Genre.jsx"));
const Watchlist = lazy(() => import("./pages/Watchlist.jsx"));
const Favorites = lazy(() => import("./pages/Favorites.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));

function App() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);
  const { loaded } = useSelector((state) => state.lists);

  // Apply the chosen theme as a class on <html> so the CSS variables
  // defined in index.css (.dark / .light) take effect app-wide.
  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(mode);
  }, [mode]);

  // Load the user's watchlist/favorites once per session, as soon as we know they're logged in
  useEffect(() => {
    if (user && !loaded) {
      dispatch(fetchLists());
    }
  }, [user, loaded, dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-cine-bg">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50
          focus:bg-cine-gold focus:text-cine-bg focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/genre" element={<Genre />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes - must be logged in */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/favorites" element={<Favorites />} />
            </Route>

            {/* Admin-only routes - must be logged in AND role === "admin" */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Catch-all - must stay last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
