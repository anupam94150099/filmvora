import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { movieService } from "../../services/movieService";
import { adminService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/admin/ConfirmModal";
import RatingBadge from "../../components/common/RatingBadge";
import Pagination from "../../components/common/Pagination";
import {
  Film,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Flame,
  Star,
  Loader2,
  ExternalLink,
} from "lucide-react";

const AdminMoviesPage = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);

  const fetchAdminMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        sort: "newest",
      };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== "all") params.isPublished = statusFilter === "published";

      const res = await movieService.getMovies(params);
      if (res.success) {
        setMovies(res.movies || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error("Error loading movies:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter]);

  useEffect(() => {
    fetchAdminMovies();
  }, [fetchAdminMovies]);

  // Quick toggle publish
  const togglePublish = async (movie) => {
    try {
      const res = await adminService.updateMovie(movie._id, {
        isPublished: !movie.isPublished,
      });
      if (res.success) {
        success(`"${movie.title}" is now ${!movie.isPublished ? "Published" : "Draft"}`);
        setMovies((prev) =>
          prev.map((m) => (m._id === movie._id ? { ...m, isPublished: !m.isPublished } : m))
        );
      }
    } catch (err) {
      error("Failed to update published status");
    }
  };

  // Quick toggle featured
  const toggleFeatured = async (movie) => {
    try {
      const res = await adminService.updateMovie(movie._id, {
        isFeatured: !movie.isFeatured,
      });
      if (res.success) {
        success(`Featured status updated for "${movie.title}"`);
        setMovies((prev) =>
          prev.map((m) => (m._id === movie._id ? { ...m, isFeatured: !m.isFeatured } : m))
        );
      }
    } catch (err) {
      error("Failed to update featured status");
    }
  };

  // Quick toggle trending
  const toggleTrending = async (movie) => {
    try {
      const res = await adminService.updateMovie(movie._id, {
        isTrending: !movie.isTrending,
      });
      if (res.success) {
        success(`Trending status updated for "${movie.title}"`);
        setMovies((prev) =>
          prev.map((m) => (m._id === movie._id ? { ...m, isTrending: !m.isTrending } : m))
        );
      }
    } catch (err) {
      error("Failed to update trending status");
    }
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!movieToDelete) return;
    try {
      const res = await adminService.deleteMovie(movieToDelete._id);
      if (res.success) {
        success(`Movie "${movieToDelete.title}" deleted successfully`);
        setMovies((prev) => prev.filter((m) => m._id !== movieToDelete._id));
      }
    } catch (err) {
      error(err.response?.data?.message || "Failed to delete movie");
    } finally {
      setMovieToDelete(null);
    }
  };

  return (
    <div className="admin-movies-page fade-in">
      {/* Header */}
      <div
        className="flex-between"
        style={{
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          padding: "1.5rem",
          borderRadius: "var(--radius-md)",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Movies Management</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Add, edit, publish, and manage video stream records
          </p>
        </div>

        <Link to="/admin/movies/add" className="btn btn-primary btn-sm">
          <Plus size={16} /> Add New Movie
        </Link>
      </div>

      {/* Filter and Search controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            padding: "0.4rem 0.8rem",
            width: "320px",
          }}
        >
          <Search size={16} color="var(--text-muted)" style={{ marginRight: "0.5rem" }} />
          <input
            type="text"
            placeholder="Search titles, actors..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: "0.875rem",
              width: "100%",
            }}
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="form-select"
          style={{ width: "auto", minWidth: "150px", padding: "0.45rem 0.8rem", fontSize: "0.85rem" }}
        >
          <option value="all">All Statuses</option>
          <option value="published">Published Only</option>
          <option value="draft">Drafts Only</option>
        </select>
      </div>

      {/* Movies Table */}
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.02)" }}>
              <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>POSTER & TITLE</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>GENRE / YEAR</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>RATING</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>VIEWS</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>STATUS</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>FLAGS</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600, textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: "3rem", textAlign: "center" }}>
                  <Loader2 size={30} className="animate-spin" color="var(--primary)" style={{ margin: "0 auto" }} />
                </td>
              </tr>
            ) : movies.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No movie records match the criteria.
                </td>
              </tr>
            ) : (
              movies.map((movie) => (
                <tr
                  key={movie._id}
                  style={{
                    borderBottom: "1px solid var(--border-subtle)",
                    transition: "background 0.15s ease",
                  }}
                  className="table-row-hover"
                >
                  {/* Poster & Title */}
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        style={{
                          width: "38px",
                          aspectRatio: "2/3",
                          borderRadius: "4px",
                          objectFit: "cover",
                          border: "1px solid var(--border-subtle)",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: "#fff" }}>{movie.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {movie.duration} mins • {movie.quality || "4K"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Genre / Year */}
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <span className="badge badge-glass">{movie.genre}</span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                      {movie.releaseYear}
                    </div>
                  </td>

                  {/* Rating */}
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <RatingBadge rating={movie.rating} size="sm" />
                  </td>

                  {/* Views */}
                  <td style={{ padding: "0.85rem 1rem", color: "#cbd5e1" }}>
                    {(movie.views || 0).toLocaleString()}
                  </td>

                  {/* Published Toggle */}
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <button
                      onClick={() => togglePublish(movie)}
                      style={{
                        padding: "0.25rem 0.6rem",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        background: movie.isPublished ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        color: movie.isPublished ? "#10b981" : "#ef4444",
                        border: movie.isPublished ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)",
                        cursor: "pointer",
                      }}
                      title="Click to toggle publish status"
                    >
                      {movie.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>

                  {/* Flags (Featured / Trending) */}
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        onClick={() => toggleFeatured(movie)}
                        style={{
                          padding: "0.2rem 0.45rem",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          background: movie.isFeatured ? "rgba(245, 197, 24, 0.2)" : "rgba(255, 255, 255, 0.05)",
                          color: movie.isFeatured ? "#f5c518" : "var(--text-muted)",
                          border: "1px solid var(--border-subtle)",
                          cursor: "pointer",
                        }}
                        title="Toggle Spotlight Hero Feature"
                      >
                        Featured
                      </button>

                      <button
                        onClick={() => toggleTrending(movie)}
                        style={{
                          padding: "0.2rem 0.45rem",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          background: movie.isTrending ? "rgba(229, 9, 20, 0.2)" : "rgba(255, 255, 255, 0.05)",
                          color: movie.isTrending ? "var(--primary)" : "var(--text-muted)",
                          border: "1px solid var(--border-subtle)",
                          cursor: "pointer",
                        }}
                        title="Toggle Trending"
                      >
                        Trending
                      </button>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                      <Link
                        to={`/movie/${movie.slug || movie._id}`}
                        target="_blank"
                        className="btn-icon"
                        style={{ width: "32px", height: "32px" }}
                        title="View Public Details"
                      >
                        <ExternalLink size={15} />
                      </Link>

                      <Link
                        to={`/admin/movies/edit/${movie._id}`}
                        className="btn-icon"
                        style={{ width: "32px", height: "32px" }}
                        title="Edit Movie"
                      >
                        <Edit2 size={15} />
                      </Link>

                      <button
                        onClick={() => {
                          setMovieToDelete(movie);
                          setDeleteModalOpen(true);
                        }}
                        className="btn-icon"
                        style={{ width: "32px", height: "32px", color: "#ef4444" }}
                        title="Delete Movie"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Movie Record"
        message={`Are you sure you want to permanently delete "${movieToDelete?.title}" from the platform catalog? This cannot be undone.`}
        confirmText="Yes, Delete Movie"
      />
    </div>
  );
};

export default AdminMoviesPage;
