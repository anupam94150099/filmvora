import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Layout & Common Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";

// Public Pages
import HomePage from "./pages/public/HomePage";
import MoviesPage from "./pages/public/MoviesPage";
import FreeStreamPage from "./pages/public/FreeStreamPage";
import MovieDetailsPage from "./pages/public/MovieDetailsPage";
import WatchPage from "./pages/public/WatchPage";
import SearchResultsPage from "./pages/public/SearchResultsPage";
import GenrePage from "./pages/public/GenrePage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import ForgotPasswordPage from "./pages/public/ForgotPasswordPage";
import ProfilePage from "./pages/public/ProfilePage";
import WatchlistPage from "./pages/public/WatchlistPage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import LegalPage from "./pages/public/LegalPage";
import NotFoundPage from "./pages/public/NotFoundPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminMoviesPage from "./pages/admin/AdminMoviesPage";
import AdminAddMoviePage from "./pages/admin/AdminAddMoviePage";
import AdminEditMoviePage from "./pages/admin/AdminEditMoviePage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminGenresPage from "./pages/admin/AdminGenresPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminTelegramPage from "./pages/admin/AdminTelegramPage";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="app-container">
      {/* Show Public Navbar & Footer only on non-admin routes */}
      {!isAdminRoute && <Navbar />}

      <div className="main-content">
        <Routes>
          {/* Public Discovery & Streaming Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/series" element={<MoviesPage />} />
          <Route path="/free-stream" element={<FreeStreamPage />} />
          <Route path="/trending" element={<MoviesPage />} />
          <Route path="/top-rated" element={<MoviesPage />} />
          <Route path="/upcoming" element={<MoviesPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/genres" element={<GenrePage />} />
          <Route path="/genre/:slug" element={<GenrePage />} />

          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* User Protected Pages */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />

          {/* Legal and Info Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/privacy" element={<Navigate to="/legal?tab=privacy" replace />} />
          <Route path="/terms" element={<Navigate to="/legal?tab=terms" replace />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Protected Suite */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="telegram" element={<AdminTelegramPage />} />
            <Route path="movies" element={<AdminMoviesPage />} />
            <Route path="movies/add" element={<AdminAddMoviePage />} />
            <Route path="movies/edit/:id" element={<AdminEditMoviePage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="genres" element={<AdminGenresPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
