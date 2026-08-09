# 🎬 MovieSphere

**Where Stories Find You.**

A full-stack movie streaming UI built with the MERN stack — browse trending titles, search and filter by genre, save watchlists and favorites, leave ratings and reviews, and manage it all through an admin dashboard with real analytics.

**🔗 Live Demo:** [moviesphere-cyan.vercel.app](https://moviesphere-cyan.vercel.app)
**🔗 API:** [moviesphere-4d6q.onrender.com](https://moviesphere-4d6q.onrender.com/api/health)

> Note: the backend is on Render's free tier, so the first request after a period of inactivity can take 30–50 seconds to wake up (cold start). Subsequent requests are fast.

---

## Features

### User
- 🔐 JWT authentication (register/login) with bcrypt password hashing
- 🎞️ Browse Trending, Popular, Top Rated, and Upcoming movies
- 🔍 Debounced search (300ms) with request cancellation to avoid race conditions
- 🎭 Filter by genre
- 📄 Movie details page with cast, YouTube trailer embed, and similar movies
- ➕ Watchlist and ❤️ Favorites, with optimistic UI updates
- ⭐ Rate and review movies (create/edit/delete your own review)
- 👤 Profile page with editable name and a personal review history
- 🌗 Dark/light mode, persisted across sessions

### Admin
- 📊 Dashboard with MongoDB aggregation-powered stats: total users/reviews, most-reviewed movies, signups over the last 14 days (charted with Recharts)
- 👥 User management (view, delete)
- 📝 Review moderation (delete any review)
- 🔒 Role-based route protection — regular users can't reach admin routes even by URL

### Engineering / resume-worthy details
- Route-based code splitting with `React.lazy` + `Suspense` — each page ships as its own chunk
- Infinite scroll (Intersection Observer) on movie rows
- Skeleton loading states throughout
- Optimistic Redux updates for watchlist/favorites with automatic rollback on failure
- Global error boundary + custom 404 page
- Auto-logout on expired JWT (401 interceptor)
- Keyboard focus states and ARIA labels; mobile nav drawer
- MongoDB aggregation pipelines for admin analytics (not just `find()`)

---

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Redux Toolkit, React Router, Recharts, Axios
**Backend:** Node.js, Express.js
**Database:** MongoDB Atlas (Mongoose)
**Auth:** JWT + bcrypt
**External API:** TMDB (The Movie Database)
**Deployment:** Vercel (frontend) + Render (backend)

---

## Project Structure

```
moviesphere/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Shared UI (Navbar, MovieCard, forms, etc.)
│       ├── pages/          # Route-level pages
│       ├── features/       # Redux slices (auth, theme, lists)
│       ├── services/       # API call layer (axios)
│       ├── hooks/          # useDebounce, useInfiniteScroll
│       └── store/          # Redux store config
└── server/                 # Express backend
    └── src/
        ├── config/         # DB connection, TMDB client
        ├── controllers/    # Route handlers
        ├── models/         # Mongoose schemas (User, Review)
        ├── middleware/     # Auth (protect/adminOnly), error handling
        └── routes/         # Express routers
```

---

## API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create an account |
| POST | `/api/auth/login` | Public | Log in, receive JWT |
| GET/PUT | `/api/auth/me` | Private | Get/update own profile |
| GET | `/api/movies/trending` \| `/popular` \| `/top-rated` \| `/upcoming` | Public | TMDB proxy endpoints |
| GET | `/api/movies/search?query=` | Public | Search movies |
| GET | `/api/movies/:id` | Public | Full movie details (cast, trailer, similar) |
| GET/POST/DELETE | `/api/users/watchlist` \| `/favorites` | Private | Manage saved lists |
| GET/POST/PUT/DELETE | `/api/reviews/...` | Mixed | Ratings & reviews CRUD |
| GET/DELETE | `/api/admin/...` | Admin only | Dashboard stats, user/review management |

---

## Running Locally

### Prerequisites
- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### Backend
```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, TMDB_API_KEY
npm run dev
```
Runs on `http://localhost:5001`.

### Frontend
```bash
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173`.

---

## Deployment Notes

- **Backend (Render):** root directory `server`, build `npm install`, start `npm start`. Set the same env vars as `.env.example`, plus `NODE_ENV=production` and `CLIENT_URL` (comma-separated list of allowed frontend origins for CORS).
- **Frontend (Vercel):** root directory `client`. Set `VITE_API_BASE_URL` to the deployed backend's `/api` URL.

---

## Acknowledgements

Movie data and images provided by [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.

Built as a portfolio project to demonstrate full-stack MERN development, JWT auth, MongoDB aggregation, and production deployment.
