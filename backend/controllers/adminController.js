import mongoose from "mongoose";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import Genre from "../models/Genre.js";
import Review from "../models/Review.js";
import { inMemoryStore } from "../utils/mockStore.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getAdminStats = async (req, res, next) => {
  try {
    const totalMovies = inMemoryStore.movies.length;
    const publishedMovies = inMemoryStore.movies.filter((m) => m.isPublished).length;
    const draftMovies = inMemoryStore.movies.filter((m) => !m.isPublished).length;
    const trendingMovies = inMemoryStore.movies.filter((m) => m.isTrending).length;
    const featuredMovies = inMemoryStore.movies.filter((m) => m.isFeatured).length;

    const totalUsers = inMemoryStore.users.length;
    const adminUsers = inMemoryStore.users.filter((u) => u.role === "admin").length;
    const regularUsers = inMemoryStore.users.filter((u) => u.role === "user").length;

    const totalGenres = inMemoryStore.genres.length;
    const totalReviews = inMemoryStore.reviews.length;
    const totalViews = inMemoryStore.movies.reduce((acc, m) => acc + (m.views || 0), 0);

    const topWatchedMovies = [...inMemoryStore.movies]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);

    const recentUsers = inMemoryStore.users.slice(0, 5);

    const viewTrends = [
      { month: "Apr", views: 28400, signups: 120 },
      { month: "May", views: 34100, signups: 180 },
      { month: "Jun", views: 42900, signups: 240 },
      { month: "Jul", views: 51200, signups: 310 },
      { month: "Aug", views: 64800, signups: 420 },
      { month: "Sep", views: 78500, signups: 560 },
    ];

    res.json({
      success: true,
      stats: {
        totalMovies,
        publishedMovies,
        draftMovies,
        trendingMovies,
        featuredMovies,
        totalUsers,
        adminUsers,
        regularUsers,
        totalGenres,
        totalReviews,
        totalViews,
      },
      topWatchedMovies,
      recentUsers,
      viewTrends,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    let filtered = [...inMemoryStore.users];

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
      );
    }

    if (role && role !== "all") {
      filtered = filtered.filter((u) => u.role === role);
    }

    res.json({
      success: true,
      total: filtered.length,
      totalPages: 1,
      currentPage: 1,
      users: filtered,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = inMemoryStore.users.find((u) => u._id.toString() === id);
    if (user) {
      user.role = role;
      return res.json({ success: true, message: `User role updated to ${role}`, user });
    }
    res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = inMemoryStore.users.find((u) => u._id.toString() === id);
    if (user) {
      user.isActive = !user.isActive;
      return res.json({ success: true, message: `User status changed`, user });
    }
    res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    inMemoryStore.users = inMemoryStore.users.filter((u) => u._id.toString() !== id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
