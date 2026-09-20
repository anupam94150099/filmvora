import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { genreService } from "../../services/genreService";
import { movieService } from "../../services/movieService";
import { useToast } from "../../context/ToastContext";
import { Film, Save, ArrowLeft, Image, Video, Sparkles, Loader2, Download, Shield, RefreshCw } from "lucide-react";

const AdminAddMoviePage = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [genresList, setGenresList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [tmdbLookupId, setTmdbLookupId] = useState("");
  const [fetchingTmdb, setFetchingTmdb] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    originalTitle: "",
    description: "",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
    trailerUrl: "",
    watchUrl: "",
    downloadUrl: "",
    contentType: "movie",
    availability: "EXTERNAL_STREAMING",
    genre: "Action",
    genres: ["Action"],
    language: "English",
    country: "India",
    releaseYear: 2025,
    duration: "120 min",
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

  const handleFetchTmdb = async () => {
    if (!tmdbLookupId.trim()) {
      if (error) error("Please enter a TMDB Movie ID or Search Query");
      return;
    }

    setFetchingTmdb(true);
    try {
      const clean = tmdbLookupId.trim().startsWith("tmdb-")
        ? tmdbLookupId.trim()
        : `tmdb-${tmdbLookupId.trim()}`;
      const res = await movieService.getMovieByIdOrSlug(clean);
      if (res.success && res.movie) {
        const m = res.movie;
        setFormData((prev) => ({
          ...prev,
          title: m.title || prev.title,
          originalTitle: m.originalTitle || m.title || "",
          description: m.description || prev.description,
          poster: m.posterUrl || m.poster || prev.poster,
          backdrop: m.bannerUrl || m.backdrop || prev.backdrop,
          trailerUrl: m.trailerUrl || prev.trailerUrl,
          contentType: m.contentType || "movie",
          availability: m.availability || "EXTERNAL_STREAMING",
          genre: m.genre || (m.genres && m.genres[0]) || prev.genre,
          genres: m.genres || [prev.genre],
          language: m.language || "English",
          country: m.country || "India",
          releaseYear: m.releaseYear || prev.releaseYear,
          duration: m.duration || prev.duration,
          rating: m.rating || prev.rating,
          director: m.director || prev.director,
          cast: Array.isArray(m.cast) ? m.cast.join(", ") : m.cast || "",
          tags: Array.isArray(m.tags) ? m.tags.join(", ") : "",
          officialSources: m.officialSources || [],
        }));
        if (success) success(`Auto-imported metadata for "${m.title}"!`);
      } else {
        if (error) error("No TMDB record found for this ID.");
      }
    } catch (err) {
      if (error) error("Failed to fetch TMDB details.");
    } finally {
      setFetchingTmdb(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      if (error) error("Please complete required fields (Title, Description)");
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
        if (success) success(`Movie "${res.movie.title}" successfully added to catalog!`);
        navigate("/admin/movies");
      }
    } catch (err) {
      if (error) error(err.response?.data?.message || "Failed to create movie record.");
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/admin/movies" className="btn-icon" title="Back to Movies">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Add New Movie or Series</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Publish legal streaming content or configure Where-to-Watch discovery titles
            </p>
          </div>
        </div>
      </div>

      {/* TMDB Quick Importer Bar */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(20, 24, 34, 0.8) 100%)",
          border: "1px solid rgba(229, 9, 20, 0.25)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem 1.5rem",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Sparkles size={22} color="var(--primary)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>
              Auto-Fill from TMDB Catalog
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Enter TMDB ID (e.g. 791373 for Pushpa 2, 10331 for Night of the Living Dead)
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="TMDB ID..."
            value={tmdbLookupId}
            onChange={(e) => setTmdbLookupId(e.target.value)}
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-subtle)",
              color: "#fff",
              padding: "0.5rem 0.85rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.85rem",
              width: "160px",
            }}
          />
          <button
            type="button"
            onClick={handleFetchTmdb}
            disabled={fetchingTmdb}
            className="btn btn-primary"
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            {fetchingTmdb ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            <span>Auto Import</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        {/* Left Column: Metadata Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* General Info */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "#fff" }}>
              General Information
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Pushpa 2: The Rule"
                  required
                />
              </div>

              <div>
                <label className="form-label">Original Title</label>
                <input
                  type="text"
                  name="originalTitle"
                  value={formData.originalTitle}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Pushpa 2"
                />
              </div>

              <div>
                <label className="form-label">Synopsis / Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input"
                  rows={4}
                  placeholder="Detailed synopsis of the movie..."
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Content Type</label>
                  <select name="contentType" value={formData.contentType} onChange={handleChange} className="form-input">
                    <option value="movie">Movie</option>
                    <option value="tv">TV Series / Web Show</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Content Availability License *</label>
                  <select name="availability" value={formData.availability} onChange={handleChange} className="form-input">
                    <option value="EXTERNAL_STREAMING">EXTERNAL_STREAMING (Where to Watch on OTT)</option>
                    <option value="PUBLIC_DOMAIN">PUBLIC_DOMAIN (Free Legal In-Platform Stream)</option>
                    <option value="CREATIVE_COMMONS">CREATIVE_COMMONS (Open Cultural Film)</option>
                    <option value="LICENSED">LICENSED (Authorized Distribution)</option>
                    <option value="OWNED">OWNED (Self-Produced Original)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Stream & Download URLs */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "#fff" }}>
              Video Playback & File Download URLs
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">Legal Watch URL (For Public Domain / Licensed Content)</label>
                <input
                  type="text"
                  name="watchUrl"
                  value={formData.watchUrl}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://archive.org/download/.../video.mp4"
                />
              </div>

              <div>
                <label className="form-label">Legitimate Direct Download URL (Optional)</label>
                <input
                  type="text"
                  name="downloadUrl"
                  value={formData.downloadUrl}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://archive.org/download/.../file.mp4"
                />
              </div>

              <div>
                <label className="form-label">Official YouTube Trailer URL</label>
                <input
                  type="text"
                  name="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>

          {/* Cast & Director */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "#fff" }}>
              Cast & Crew Details
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="form-label">Director</label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Christopher Nolan, Sukumar"
                />
              </div>

              <div>
                <label className="form-label">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. India, United States"
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Cast Members (comma separated)</label>
                <input
                  type="text"
                  name="cast"
                  value={formData.cast}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Allu Arjun, Rashmika Mandanna, Fahadh Faasil"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Classification & Media Previews */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "#fff" }}>
              Classification & Stats
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">Primary Genre</label>
                <select name="genre" value={formData.genre} onChange={handleChange} className="form-input">
                  {genresList.map((g) => (
                    <option key={g._id} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Release Year</label>
                  <input
                    type="number"
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">IMDb/TMDB Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Language</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Hindi, English, Telugu..."
                />
              </div>

              <div>
                <label className="form-label">Runtime / Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="145 min"
                />
              </div>

              {/* Toggles */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#fff", cursor: "pointer", fontSize: "0.85rem" }}>
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
                  <span>Feature on Hero Carousel</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#fff", cursor: "pointer", fontSize: "0.85rem" }}>
                  <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} />
                  <span>Show in Trending Row</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#fff", cursor: "pointer", fontSize: "0.85rem" }}>
                  <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} />
                  <span>Published (Visible to Users)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Media Links */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "#fff" }}>
              Poster & Backdrop
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">Poster Image URL</label>
                <input type="text" name="poster" value={formData.poster} onChange={handleChange} className="form-input" />
              </div>
              <div>
                <label className="form-label">Backdrop Image URL</label>
                <input type="text" name="backdrop" value={formData.backdrop} onChange={handleChange} className="form-input" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{
              padding: "0.9rem",
              fontSize: "1rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>Save & Publish Title</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddMoviePage;
