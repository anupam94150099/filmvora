# 🎬 FILMVORA — Production-Ready OTT Movie Streaming Platform

> **"Stories Worth Watching."**

FILMVORA is a modern, responsive, high-performance OTT entertainment and movie streaming platform designed with a premium cinematic dark aesthetic. Users can discover curated collections, stream legally hosted High Definition / 4K Ultra HD films, maintain custom watchlists, write audience reviews, and explore categorized genres. Administrators get a full control suite to manage movies, categories, users, streaming analytics, and system configurations.

---

## 🛠️ Technology Stack (Strictly No Python)

* **Frontend:** React.js, Vite, JavaScript (ES6+), HTML5, Custom CSS3 Cinematic Design System, Lucide Icons, React Router v6, Axios
* **Backend:** Node.js, Express.js (ES Modules), REST APIs
* **Database & ORM:** MongoDB, Mongoose ODM
* **Security & Auth:** JSON Web Tokens (JWT), bcrypt.js password hashing, Helmet security headers, CORS origin protection, Express Rate Limiting

---

## 🌟 Key Platform Features

### 🍿 Public & User Experience
* **Hero Banner Spotlight:** Dynamic full-width featured film carousel with high-resolution backdrops, trailers modal preview, rating tags, and quick-watch CTAs.
* **Custom HTML5 Video Player:** Custom-engineered streaming player with timeline scrubber, buffered stream indicators, volume sliders, 10s skip/rewind, playback speed selector (0.5x – 2x), Picture-in-Picture mode, theater mode, and full-screen controls.
* **Live Keyword & Multi-Filter Search:** Filter dynamically by genre, release year, streaming language, and minimum rating (8.0+, 7.0+, 6.0+).
* **Watchlist Engine:** Instant toggle to add/remove titles to personal watchlists with optimistic UI updates.
* **Audience Reviews & Live Ratings:** Authenticated users can leave reviews and star ratings (1–10) with automatic recalculation of overall movie averages.
* **Legal & Compliance Center:** Tabbed policy portal covering Privacy, Terms of Service, DMCA Complaint filing procedures, and Content Submission guidelines.
* **Profile Management:** Customized avatar picker, profile updater, and password change utility.

### 🛡️ Administrator Management Suite
* **Dashboard Overview:** Real-time KPI metric cards (Total Movies, Total Users, Total Views, Published/Draft counts, Trending status).
* **Movies Management:** Full data table with search, genre filters, inline published/draft switches, spotlight toggle, and trending toggle.
* **Add & Edit Movie Studio:** Form with live poster & backdrop preview, genre multi-select, video stream URL tester, director and cast tags.
* **Users Management:** Searchable user table, role adjustment (User / Admin), account activation/deactivation toggle, and account deletion with confirmation.
* **Category & Genre Hub:** Manage taxonomies with live title counters and image banners.
* **Streaming Analytics & Trends:** Monthly stream volume bars, audience watch hours, device breakdown (Desktop / Mobile / Smart TV), and global reach telemetry.
* **System Settings:** Global brand parameters, video CDN quality controls, maintenance mode, and support contacts.

---

## 📂 Project Architecture

```
FILMVORA/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── adminController.js    # Admin analytics & user moderation
│   │   ├── authController.js     # User registration, login, profile & JWT
│   │   ├── genreController.js    # Category management & movie counts
│   │   ├── movieController.js    # Movie CRUD, filtering & reviews
│   │   └── userController.js     # Watchlist management
│   ├── middleware/
│   │   ├── adminMiddleware.js    # Admin authorization verification
│   │   ├── authMiddleware.js     # JWT Bearer token authentication
│   │   └── errorMiddleware.js    # Centralized error handling & 404s
│   ├── models/
│   │   ├── Genre.js              # Category schema
│   │   ├── Movie.js              # Movie stream schema with slug & tags
│   │   ├── Review.js             # User review & rating schema
│   │   └── User.js               # User account schema with bcrypt
│   ├── routes/
│   │   ├── adminRoutes.js        # /api/admin
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── genreRoutes.js        # /api/genres
│   │   ├── movieRoutes.js        # /api/movies
│   │   └── userRoutes.js         # /api/users
│   ├── utils/
│   │   ├── generateToken.js      # JWT signing utility
│   │   └── slugify.js            # URL-friendly slug generator
│   ├── .env                      # Environment config
│   ├── .env.example              # Env sample template
│   ├── package.json
│   ├── seed.js                   # Seeder script for demo catalog & accounts
│   └── server.js                 # Express server entrypoint
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/            # AdminLayout, AdminSidebar, AdminNavbar, StatCard, ConfirmModal
│   │   │   └── common/           # Navbar, Footer, HeroBanner, MovieCard, MovieRow, VideoPlayer, TrailerModal, etc.
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication provider
│   │   │   ├── ToastContext.jsx  # Notification toast provider
│   │   │   └── WatchlistContext.jsx # Watchlist provider
│   │   ├── pages/
│   │   │   ├── admin/            # Dashboard, Movies, AddMovie, EditMovie, Users, Genres, Analytics, Settings
│   │   │   └── public/           # Home, Movies, MovieDetails, Watch, Search, Genres, Login, Register, Profile, Watchlist, etc.
│   │   ├── services/
│   │   │   ├── api.js            # Axios client with JWT interceptor
│   │   │   ├── adminService.js   # Admin REST calls
│   │   │   ├── genreService.js   # Genre REST calls
│   │   │   └── movieService.js   # Movie REST calls
│   │   ├── styles/
│   │   │   ├── components.css    # Reusable component classes & responsive grids
│   │   │   ├── global.css        # Resets, animations, glassmorphism
│   │   │   └── variables.css     # Dark cinematic theme tokens
│   │   ├── App.jsx               # Routes setup
│   │   └── main.jsx              # React DOM root
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* **Node.js** (v18.0.0 or higher)
* **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

---

### 2. Backend Setup & Seeding

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create or verify `.env` file in `backend/`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/filmvora
   JWT_SECRET=filmvora_jwt_super_secret_key_2026_cinematic
   JWT_EXPIRES_IN=30d
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```
4. **Seed the database** with demo movies, categories, and initial admin/user accounts:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *Backend server will start at `http://localhost:5000`.*

---

### 3. Frontend Setup

1. In a second terminal, navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@filmvora.com` | `admin123` | Full Admin Panel (`/admin`) + Public Streaming |
| **Demo User** | `user@filmvora.com` | `user123` | Public Streaming, Watchlist, Reviews, Profile |

*(Note: The Login page includes 1-click **Demo Admin** and **Demo User** autofill buttons for immediate evaluation).*

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register new user account
* `POST /api/auth/login` — Sign in and receive JWT token
* `GET /api/auth/me` — Get current user details (Private)
* `PUT /api/auth/profile` — Update user name and avatar (Private)
* `PUT /api/auth/change-password` — Change password (Private)
* `POST /api/auth/forgot-password` — Request password reset email (Public)

### Movies (`/api/movies`)
* `GET /api/movies` — Filter, search, sort, and paginate movies
* `GET /api/movies/:idOrSlug` — Get full movie details and related recommendations
* `POST /api/movies` — Create new movie title (Admin only)
* `PUT /api/movies/:id` — Update movie details (Admin only)
* `DELETE /api/movies/:id` — Delete movie record (Admin only)
* `GET /api/movies/:id/reviews` — Get movie reviews
* `POST /api/movies/:id/reviews` — Add review and rating (Private)

### Categories & Genres (`/api/genres`)
* `GET /api/genres` — List all genres with live movie counts
* `GET /api/genres/:slug` — Get genre details and curated film collection
* `POST /api/genres` — Create category (Admin only)
* `PUT /api/genres/id/:id` — Update category (Admin only)
* `DELETE /api/genres/id/:id` — Delete category (Admin only)

### User Watchlist (`/api/users`)
* `GET /api/users/watchlist` — Get current user watchlist (Private)
* `POST /api/users/watchlist/toggle/:movieId` — Toggle movie in watchlist (Private)

### Administrator Control (`/api/admin`)
* `GET /api/admin/stats` — High-level platform statistics & trends
* `GET /api/admin/users` — Search and manage user accounts
* `PUT /api/admin/users/:id/role` — Update user role (user/admin)
* `PUT /api/admin/users/:id/status` — Toggle user account active status
* `DELETE /api/admin/users/:id` — Delete user account

---

## 🔒 Security & Content Compliance
* **No Piracy:** Filmvora utilizes open-source authorized test streams (Blender Open Projects: Tears of Steel, Sintel, Big Buck Bunny, Elephants Dream) and Creative Commons licensed assets.
* **Password Encryption:** Passwords hashed with bcrypt (salt rounds = 10).
* **JWT Expiration:** Tokens strictly validated with signed secret and expiration policy.
* **Rate Limiting:** Global IP rate limiting prevents brute-force abuse.
* **Sanitization & Error Masking:** Production stack traces suppressed and Mongo duplicate key errors converted to clean user-friendly JSON messages.

---

## 📄 License
Released under the MIT License. Built for Filmvora Entertainment.
