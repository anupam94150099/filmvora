import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { genreService } from "../../services/genreService";
import { useToast } from "../../context/ToastContext";
import { Film, Save, ArrowLeft, Image, Video, Sparkles, Loader2 } from "lucide-react";

const AdminAddMoviePage = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [genresList, setGenresList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    genre: "Sci-Fi",
    genres: ["Sci-Fi", "Action"],
    language: "English",
    releaseYear: 2025,
    duration: 120,
    rating: 8.5,
    director: "",
    cast: "",
    ageRating: "13+",
    quality: "4K Ultra HD",
    isFeatured: false,
    isTrending: false,
    isPublished: true,
    tags: "",
  });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await genreService.getGenres();
        if (res.success && res.genres.length > 0) {
          setGenresList(res.genres);
          setFormData((prev) => ({ ...prev, genre: res.genres[0].name }));
        }
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };
    fetchGenres();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.poster || !formData.backdrop || !formData.videoUrl) {
      error("Please complete all required fields (title, description, poster, backdrop, videoUrl)");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        cast: typeof formData.cast === "string" ? formData.cast.split(",").map((s) => s.trim()).filter(Boolean) : formData.cast,
        tags: typeof formData.tags === "string" ? formData.tags.split(",").map((s) => s.trim()).filter(Boolean) : formData.tags,
        genres: [formData.genre],
      };

      const res = await adminService.createMovie(payload);
      if (res.success) {
        success(`Movie "${res.movie.title}" successfully added to the catalog!`);
        navigate("/admin/movies");
      }
    } catch (err) {
      error(err.response?.data?.message || "Failed to create movie record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-add-movie-page fade-in" style={{ paddingBottom: "4rem" }}>
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
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Add New Movie Title</h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn btn-primary btn-sm"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>Publish Title</span>
        </button>
      </div>

      {/* Main Grid: Form & Live Previews */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "2.5rem" }} className="movie-form-grid">
        {/* Form Column */}
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

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Movie Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. The Quantum Paradox"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Synopsis / Description *</label>
              <textarea
                name="description"
                rows={4}
                required
                placeholder="Captivating summary of the film plot..."
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>

            {/* Primary Genre & Language */}
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
                  {genresList.length === 0 && (
                    <>
                      <option value="Action">Action</option>
                      <option value="Sci-Fi">Sci-Fi</option>
                      <option value="Drama">Drama</option>
                      <option value="Thriller">Thriller</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Audio Language</label>
                <input
                  type="text"
                  name="language"
                  placeholder="English"
                  value={formData.language}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Year, Duration, Rating */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Release Year *</label>
                <input
                  type="number"
                  name="releaseYear"
                  required
                  value={formData.releaseYear}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration (Mins) *</label>
                <input
                  type="number"
                  name="duration"
                  required
                  value={formData.duration}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Critic Rating (0-10)</label>
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

            {/* Age Rating & Quality */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Age Rating</label>
                <select
                  name="ageRating"
                  value={formData.ageRating}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="PG">PG (General)</option>
                  <option value="13+">13+ (Teen)</option>
                  <option value="16+">16+ (Mature)</option>
                  <option value="18+">18+ (Adults Only)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Stream Quality Tag</label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="4K Ultra HD">4K Ultra HD</option>
                  <option value="1080p Full HD">1080p Full HD</option>
                  <option value="720p HD">720p HD</option>
                </select>
              </div>
            </div>

            {/* Director & Cast */}
            <div className="form-group">
              <label className="form-label">Director</label>
              <input
                type="text"
                name="director"
                placeholder="e.g. Marcus Vance"
                value={formData.director}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Starring Cast (Comma separated)</label>
              <input
                type="text"
                name="cast"
                placeholder="Elena Vance, Julian Thorne, Devon Cole"
                value={formData.cast}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem", marginTop: "1rem" }}>
              Media Streams & Key Assets
            </h3>

            {/* Video Streaming URL */}
            <div className="form-group">
              <label className="form-label">Video Streaming Source URL (MP4 / HLS) *</label>
              <input
                type="url"
                name="videoUrl"
                required
                placeholder="https://..."
                value={formData.videoUrl}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Trailer URL */}
            <div className="form-group">
              <label className="form-label">Trailer Video URL</label>
              <input
                type="url"
                name="trailerUrl"
                placeholder="https://..."
                value={formData.trailerUrl}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Poster URL */}
            <div className="form-group">
              <label className="form-label">Poster Image URL (2:3 Aspect Ratio) *</label>
              <input
                type="url"
                name="poster"
                required
                placeholder="https://images.unsplash.com/..."
                value={formData.poster}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Backdrop URL */}
            <div className="form-group">
              <label className="form-label">Backdrop Banner URL (16:9 Aspect Ratio) *</label>
              <input
                type="url"
                name="backdrop"
                required
                placeholder="https://images.unsplash.com/..."
                value={formData.backdrop}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Checkboxes: Flags */}
            <div style={{ display: "flex", gap: "2rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
                />
                <span>Published (Visible to public)</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
                />
                <span>Spotlight Featured Hero</span>
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

        {/* Live Artwork Previews Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Poster Preview */}
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
            }}
          >
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Image size={16} color="var(--primary)" /> Poster Preview
            </h4>
            <div style={{ width: "160px", aspectRatio: "2/3", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
              <img
                src={formData.poster}
                alt="Poster preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
          </div>

          {/* Backdrop Preview */}
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
            }}
          >
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Video size={16} color="var(--accent-cyan)" /> Hero Backdrop Preview
            </h4>
            <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
              <img
                src={formData.backdrop}
                alt="Backdrop preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddMoviePage;
