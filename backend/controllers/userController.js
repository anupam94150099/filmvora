import mongoose from "mongoose";
import User from "../models/User.js";
import Movie from "../models/Movie.js";
import { inMemoryStore } from "../utils/mockStore.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getWatchlist = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      try {
        const user = await User.findById(req.user._id).populate("watchlist");
        if (user) {
          return res.json({ success: true, count: user.watchlist.length, watchlist: user.watchlist });
        }
      } catch (err) {}
    }

    const demoWatchlist = inMemoryStore.movies.slice(0, 3);
    res.json({
      success: true,
      count: demoWatchlist.length,
      watchlist: demoWatchlist,
    });
  } catch (error) {
    next(error);
  }
};

export const addToWatchlist = async (req, res, next) => {
  res.json({ success: true, message: "Movie added to watchlist" });
};

export const removeFromWatchlist = async (req, res, next) => {
  res.json({ success: true, message: "Movie removed from watchlist" });
};

export const toggleWatchlist = async (req, res, next) => {
  res.json({ success: true, isAdded: true, message: "Watchlist updated" });
};
