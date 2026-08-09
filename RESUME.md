# Resume Writeup — MovieSphere

Copy whichever version fits your resume format best.

---

## Option A — Standard resume bullets

**MovieSphere — Full-Stack Movie Streaming UI** | React, Node.js, Express, MongoDB, Redux Toolkit
*[Live Demo](https://moviesphere-cyan.vercel.app) · [GitHub](https://github.com/nitish-157/moviesphere)*

- Built a full-stack MERN movie browsing platform with JWT authentication, role-based access control, and bcrypt password hashing, integrating the TMDB API for real-time movie data.
- Implemented debounced search with request cancellation (AbortController) to prevent race conditions, infinite scroll via the Intersection Observer API, and route-based code splitting with React.lazy/Suspense to reduce initial bundle size.
- Designed an admin analytics dashboard using MongoDB aggregation pipelines ($group, $avg, $dateToString) to compute review trends and signup metrics, visualized with Recharts.
- Managed global state with Redux Toolkit, including optimistic UI updates for watchlist/favorites with automatic rollback on API failure.
- Deployed frontend to Vercel and backend to Render with environment-based configuration and CORS handling for multiple origins.

---

## Option B — Shorter (2-3 bullets, for tighter resume space)

**MovieSphere — Full-Stack Movie Streaming UI** | React, Node.js, Express, MongoDB
*[Live Demo](https://moviesphere-cyan.vercel.app)*

- Developed a full-stack movie discovery platform (JWT auth, TMDB API integration, MongoDB) with search, watchlist/favorites, ratings & reviews, and an admin dashboard powered by MongoDB aggregation pipelines.
- Implemented performance-focused features including debounced/cancellable search, infinite scroll, and route-based code splitting, plus optimistic Redux state updates with rollback on failure.

---

## Option C — One-liner (for a projects list / GitHub pinned repo description)

Full-stack movie streaming UI (MERN) with JWT auth, TMDB integration, watchlists, reviews, and an admin analytics dashboard built on MongoDB aggregation pipelines.

---

## Interview talking points

If asked to elaborate on this project, these are the most defensible/interesting technical decisions to discuss:

1. **Race condition handling in search** — using AbortController to cancel stale requests when the user types quickly, so an older slow response can't overwrite a newer one.
2. **Optimistic updates with rollback** — watchlist/favorite toggles update the UI immediately (Redux), then reconcile with the server response; on failure, the change is rolled back and the user sees an error toast.
3. **Security: privilege escalation prevention** — the registration endpoint never reads a `role` field from the request body, so a user can't self-promote to admin by manipulating the request. Admin status can only be set at the database level.
4. **MongoDB aggregation** — the admin dashboard's "most-reviewed movies" and "signups over time" stats are computed with `$group`, `$avg`, and `$dateToString` aggregation stages rather than pulling all documents and computing in JavaScript — a meaningful performance difference at scale.
5. **Code splitting** — each route is a separate JS chunk (visible in the Vercel build output), so users only download the code for the page they're actually visiting.
