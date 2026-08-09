import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiSun, FiMoon, FiSearch, FiMenu, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

import { logout } from "../features/auth/authSlice.js";
import { toggleTheme } from "../features/theme/themeSlice.js";
import { resetLists } from "../features/lists/listsSlice.js";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetLists());
    toast.success("Logged out");
    setMobileOpen(false);
    navigate("/login");
  };

  const navLinkClass =
    "text-sm text-cine-muted hover:text-cine-text transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-gold";

  return (
    <nav className="sticky top-0 z-30 border-b border-cine-border bg-cine-bg backdrop-blur">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: brand + primary nav (desktop) */}
        <div className="flex items-center gap-8">
          <Link to="/" className={`font-display text-xl tracking-wide text-cine-text shrink-0 ${navLinkClass}`}>
            MOVIE<span className="text-cine-gold">SPHERE</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={navLinkClass}>
              Home
            </Link>
            <Link to="/genre" className={navLinkClass}>
              Genres
            </Link>
            {user && (
              <>
                <Link to="/watchlist" className={navLinkClass}>
                  Watchlist
                </Link>
                <Link to="/favorites" className={navLinkClass}>
                  Favorites
                </Link>
              </>
            )}
            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className={`text-cine-gold hover:text-cine-goldSoft font-medium ${navLinkClass}`}
              >
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Right: icon actions + auth (desktop), hamburger (mobile) */}
        <div className="flex items-center gap-2 ml-auto">
          <Link
            to="/search"
            aria-label="Search movies"
            className="text-cine-muted hover:text-cine-gold transition-colors p-2 rounded-md
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-gold"
          >
            <FiSearch size={18} />
          </Link>

          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle dark mode"
            className="text-cine-muted hover:text-cine-gold transition-colors p-2 rounded-md
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-gold"
          >
            {mode === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* Divider + auth controls - desktop only, mobile uses the drawer instead */}
          <div className="hidden md:block w-px h-6 bg-cine-border mx-2" />

          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/profile"
                className={`flex items-center gap-2 ${navLinkClass}`}
              >
                <span className="w-7 h-7 rounded-full bg-cine-gold/20 text-cine-gold text-xs font-semibold flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-cine-danger hover:text-red-400 font-medium transition-colors
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-danger rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className={navLinkClass}>
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm bg-cine-gold hover:bg-cine-goldSoft text-cine-bg font-semibold px-4 py-1.5 rounded-md transition-colors
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-gold"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Hamburger - mobile only */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden text-cine-text p-2 rounded-md
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-gold"
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-cine-border px-6 py-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMobileOpen(false)} className={navLinkClass}>
            Home
          </Link>
          <Link to="/genre" onClick={() => setMobileOpen(false)} className={navLinkClass}>
            Genres
          </Link>
          {user && (
            <>
              <Link to="/watchlist" onClick={() => setMobileOpen(false)} className={navLinkClass}>
                Watchlist
              </Link>
              <Link to="/favorites" onClick={() => setMobileOpen(false)} className={navLinkClass}>
                Favorites
              </Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className={navLinkClass}>
                Profile ({user.name})
              </Link>
            </>
          )}
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className={`text-cine-gold font-medium ${navLinkClass}`}
            >
              Admin
            </Link>
          )}

          <div className="border-t border-cine-border pt-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="text-sm text-cine-danger font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-danger rounded"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" onClick={() => setMobileOpen(false)} className={navLinkClass}>
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm bg-cine-gold text-cine-bg font-semibold px-4 py-1.5 rounded-md
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-gold"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
