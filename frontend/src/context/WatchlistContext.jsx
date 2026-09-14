import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const WatchlistContext = createContext(null);

export const WatchlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { success, error, info } = useToast();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Watchlist when user logs in
  const fetchWatchlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWatchlist([]);
      return;
    }
    setLoading(true);
    try {
      const response = await API.get("/users/watchlist");
      if (response.data.success) {
        setWatchlist(response.data.watchlist);
      }
    } catch (err) {
      console.error("Error loading watchlist:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  // Check if movie is in watchlist
  const isInWatchlist = (movieId) => {
    return watchlist.some(
      (m) => (m._id ? m._id.toString() : m.toString()) === movieId.toString()
    );
  };

  // Toggle movie in watchlist
  const toggleWatchlist = async (movie) => {
    if (!isAuthenticated) {
      info("Please sign in to save movies to your watchlist");
      return false;
    }

    const movieId = movie._id || movie;
    const exists = isInWatchlist(movieId);

    // Optimistic UI update
    if (exists) {
      setWatchlist((prev) =>
        prev.filter((m) => (m._id ? m._id.toString() : m.toString()) !== movieId.toString())
      );
    } else {
      setWatchlist((prev) => [typeof movie === "object" ? movie : { _id: movieId }, ...prev]);
    }

    try {
      const response = await API.post(`/users/watchlist/toggle/${movieId}`);
      if (response.data.success) {
        if (response.data.isAdded) {
          success("Added to Watchlist");
        } else {
          info("Removed from Watchlist");
        }
        return response.data.isAdded;
      }
    } catch (err) {
      // Rollback on error
      fetchWatchlist();
      error(err.response?.data?.message || "Failed to update watchlist");
      return false;
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        loading,
        isInWatchlist,
        toggleWatchlist,
        refreshWatchlist: fetchWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};
