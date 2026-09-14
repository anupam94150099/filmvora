import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { movieService } from "../../services/movieService";
import { adminService } from "../../services/adminService";
import { genreService } from "../../services/genreService";
import { useToast } from "../../context/ToastContext";
import { Film, Save, ArrowLeft, Image, Video, Loader2 } from "lucide-react";

const AdminEditMoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [genresList, setGenresList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    poster: "",
    backdrop: "",
    trailerUrl: "",
    videoUrl: "",
    genre: "Action",
    language: "English",
    releaseYear: 2025,
    duration: 120,
    rating: 8.0,
    director: "",
    cast: "",
    ageRating: "13+",
    quality: "4K Ultra HD",
    isFeatured: false,
    isTrending: false,
    isPublished: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [movieRes, genresRes] = await Promise.all([
          movieService.getMovieByIdOrSlug(id),
          genreService.getGenres(),
        ]);

        if (genresRes.success) {
          setGenresList(genresRes.genres || []);
        }

        if (movieRes.success) {
          const m = movieRes.movie;
          setFormData({
            title: m.title || "",
            description: m.description || "",
            poster: m.poster || "",
            backdrop: m.backdrop || "",
            trailerUrl: m.trailerUrl || "",
            videoUrl: m.videoUrl || "",
            genre: m.genre || "Action",
            language: m.language || "English",
            releaseYear: m.releaseYear || 2025,
            duration: m.duration || 120,
            rating: m.rating || 8.0,
            director: m.director || "",
            cast: Array.isArray(m.cast) ? m.cast.join(", ") : m.cast || "",
            ageRating: m.ageRating || "13+",
            quality: m.quality || "4K Ultra HD",
            isFeatured: Boolean(m.isFeatured),
            isTrending: Boolean(m.isTrending),
            isPublished: Boolean(m.isPublished),
          });
        }
      } catch (err) {
        error("Failed to load movie data for editing");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        cast: typeof formData.cast === "string" ? formData.cast.split(",").map((s) => s.trim()).filter(Boolean) : formData.cast,
        genres: [formData.genre],
      };

      const res = await adminService.updateMovie(id, payload);
      if (res.success) {
        success(`Movie "${formData.title}" updated successfully!`);
        navigate("/admin/movies");
      }
    } catch (err) {
      error(err.response?.data?.message || "Failed to update movie record.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh" }}>
        <Loader2 size={36} className="animate-spin" color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="admin-edit-movie-page fade-in" style={{ paddingBottom: "4rem" }}>
      {/* Header */}
      <div
        className="flex-between"
        style={{
          marginBottom: "2rem",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          padding: "1.5rem",
          borderRadius: "var(--radius-md)",
        }}
      >
        <div>
          <Link
            to="/admin/movies"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}
          >
            <ArrowLeft size={16} /> Back to Movies List
          </Link>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Edit Movie: {formData.title}</h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn btn-primary btn-sm"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>Save Changes</span>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "2.5rem" }} className="movie-form-grid">
        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem" }}>
              General Information
            </h3>

            <div className="form-group">
              <label className="form-label">Movie Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description / Synopsis *</label>
              <textarea
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Primary Genre *</label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="form-select"
                >
                  {genresList.map((g) => (
                    <option key={g._id} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Language</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Release Year</label>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration (Mins)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rating (0-10)</label>
                <input
                  type="number"
                  name="rating"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Director</label>
              <input
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cast (Comma separated)</label>
              <input
                type="text"
                name="cast"
                value={formData.cast}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem", marginTop: "1rem" }}>
              Media Streams & Assets
            </h3>

            <div className="form-group">
              <label className="form-label">Video Streaming URL *</label>
              <input
                type="url"
                name="videoUrl"
                required
                value={formData.videoUrl}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Trailer URL</label>
              <input
                type="url"
                name="trailerUrl"
                value={formData.trailerUrl}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Poster URL *</label>
              <input
                type="url"
                name="poster"
                required
                value={formData.poster}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Backdrop URL *</label>
              <input
                type="url"
                name="backdrop"
                required
                value={formData.backdrop}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div style={{ display: "flex", gap: "2rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
                />
                <span>Published</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
                />
                <span>Featured Hero</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  name="isTrending"
                  checked={formData.isTrending}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
                />
                <span>Trending Badge</span>
              </label>
            </div>
          </div>
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
            }}
          >
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem" }}>Poster Preview</h4>
            <div style={{ width: "160px", aspectRatio: "2/3", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
              <img
                src={formData.poster}
                alt="Poster"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
            }}
          >
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem" }}>Backdrop Preview</h4>
            <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
              <img
                src={formData.backdrop}
                alt="Backdrop"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditMoviePage;
