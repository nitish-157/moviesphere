# MovieSphere — Step 1: Project Scaffold

## Structure
```
moviesphere/
├── client/          # React + Vite + Tailwind + Redux Toolkit
│   ├── src/
│   │   ├── components/   (shared UI components go here)
│   │   ├── pages/         (route-level pages go here)
│   │   ├── store/          (Redux store)
│   │   ├── features/       (Redux slices, grouped by feature)
│   │   ├── services/        (API call helpers, e.g. axios instance)
│   │   ├── hooks/
│   │   └── utils/
│   └── ...config files
└── server/          # Node + Express + MongoDB
    ├── src/
    │   ├── config/      (db connection, etc.)
    │   ├── routes/
    │   ├── controllers/
    │   ├── models/
    │   └── middleware/
    └── ...config files
```

## Setup

### Backend
```bash
cd server
npm install
cp .env.example .env   # fill in your MongoDB URI, JWT secret, TMDB key
npm run dev
```
Server runs on `http://localhost:5000`. Visit `/api/health` to confirm it's up.

### Frontend
```bash
cd client
npm install
npm run dev
```
App runs on `http://localhost:5173`. You should see a "MovieSphere" placeholder screen —
that confirms Vite, Tailwind, Redux, and React Router are all wired correctly.

## What's done in this step
- Folder structure for both client and server
- Express server with health check route, CORS, error-handling middleware
- MongoDB connection helper (needs your `MONGO_URI` in `.env`)
- Vite + React app with Tailwind (dark mode ready) and Redux store wired up
- React Router + toast notifications wired into `main.jsx`

## Next step
Step 2 — Backend server + DB connection (already partly done here) will be verified,
then Step 3 adds the TMDB API proxy routes.
