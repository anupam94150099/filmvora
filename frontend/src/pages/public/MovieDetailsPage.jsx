import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { movieService } from "../../services/movieService";
import { useAuth } from "../../context/AuthContext";
import { useWatchlist } from "../../context/WatchlistContext";
import { useToast } from "../../context/ToastContext";
import RatingBadge from "../../components/common/RatingBadge";
import MovieRow from "../../components/common/MovieRow";
import TrailerModal from "../../components/common/TrailerModal";
import DownloadModal from "../../components/common/DownloadModal";
import {
  Play,
  Film,
  Bookmark,
  Check,
  Star,
  Clock,
  Calendar,
  Globe,
  User,
  Shield,
  MessageSquare,
  Send,
  Loader2,
  Share2,
  Download,
  MessageCircle,
  Sparkles,
  Copy,
} from "lucide-react";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { success, error, info } = useToast();

  const [movie, setMovie] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  // Review Form state
  const [userRating, setUserRating] = useState(9);
  const [userComment, setUserComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const [detailsRes, reviewsRes] = await Promise.all([
          movieService.getMovieByIdOrSlug(id),
          movieService.getReviews(id),
        ]);

        if (detailsRes.success) {
          setMovie(detailsRes.movie);
          setRelated(detailsRes.related || []);
          // Set dynamic page title
          document.title = `${detailsRes.movie.title} - Watch on Filmvora`;
        }
        if (reviewsRes.success) {
          setReviews(reviewsRes.reviews || []);
        }
      } catch (err) {
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "80vh" }}>
        <Loader2 size={40} className="animate-spin" color="var(--primary)" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container flex-center" style={{ minHeight: "70vh", flexDirection: "column", gap: "1rem" }}>
        <h2>Movie Not Found</h2>
        <p style={{ color: "var(--text-muted)" }}>
          The movie you are looking for does not exist or has been unpublished.
        </p>
        <Link to="/movies" className="btn btn-primary">
          Browse Movies
        </Link>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie._id);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      info("Please sign in to write a review");
      return;
    }

    if (!userComment.trim()) {
      error("Please write a review comment");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await movieService.addReview(movie._id, {
        rating: userRating,
        comment: userComment.trim(),
      });

      if (res.success) {
        success("Review submitted successfully!");
        setUserComment("");
        setMovie((prev) => ({ ...prev, rating: res.newRating }));
        // Refresh reviews
        const updatedReviews = await movieService.getReviews(movie._id);
        if (updatedReviews.success) {
          setReviews(updatedReviews.reviews);
        }
      }
    } catch (err) {
      error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success("Movie link copied to clipboard!");
    }
  };

  return (
    <div className="movie-details-page fade-in" style={{ paddingBottom: "5rem" }}>
      {/* Hero Backdrop Spotlight */}
      <div
        style={{
          position: "relative",
          minHeight: "65vh",
          maxHeight: "700px",
          display: "flex",
          alignItems: "flex-end",
          backgroundImage: `url(${movie.backdrop || movie.poster})`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          paddingBottom: "3rem",
        }}
      >
        {/* Gradient Mask Overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,12,16,0.3) 0%, rgba(10,12,16,0.85) 60%, rgba(10,12,16,1) 100%), linear-gradient(90deg, rgba(10,12,16,0.95) 0%, rgba(10,12,16,0.6) 50%, rgba(10,12,16,0.95) 100%)",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "2.5rem",
              alignItems: "flex-end",
            }}
            className="movie-details-header"
          >
            {/* Poster Card */}
            <div
              style={{
                width: "240px",
                aspectRatio: "2/3",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                boxShadow: "0 12px 36px rgba(0,0,0,0.8)",
                border: "1px solid var(--border-subtle)",
                display: "block",
              }}
              className="details-poster-box"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Info and Actions */}
            <div>
              {/* Meta tags */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
                <RatingBadge rating={movie.rating} size="lg" />
                <span className="badge badge-glass">{movie.releaseYear}</span>
                <span className="badge badge-glass">{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                <span className="badge badge-glass">{movie.ageRating || "13+"}</span>
                <span className="badge badge-glass">{movie.quality || "4K UHD"}</span>
                <span className="badge badge-red">{movie.genre}</span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  marginBottom: "1rem",
                }}
              >
                {movie.title}
              </h1>

              {/* Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                <button
                  onClick={() => navigate(`/watch/${movie.slug || movie._id}`)}
                  className="btn btn-primary btn-lg"
                >
                  <Play size={22} fill="#fff" />
                  <span>Watch Movie</span>
                </button>

                {movie.trailerUrl && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="btn btn-secondary btn-lg"
                  >
                    <Film size={20} />
                    <span>Watch Trailer</span>
                  </button>
                )}

                <button
                  onClick={() => toggleWatchlist(movie)}
                  className="btn btn-glass"
                  style={{
                    height: "48px",
                    padding: "0 1.25rem",
                    color: inWatchlist ? "var(--primary)" : "#fff",
                  }}
                >
                  {inWatchlist ? <Check size={20} /> : <Bookmark size={20} />}
                  <span>{inWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
                </button>

                <button
                  onClick={() => setDownloadModalOpen(true)}
                  className="btn btn-glass"
                  style={{ height: "48px", padding: "0 1.25rem" }}
                  title="Download Movie via API"
                >
                  <Download size={20} />
                  <span>Download</span>
                </button>

                <button
                  onClick={handleShare}
                  className="btn btn-icon"
                  style={{ width: "48px", height: "48px" }}
                  title="Share Movie"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {/* Viral 1-Click WhatsApp & Telegram Share */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  flexWrap: "wrap",
                  marginTop: "1.25rem",
                  padding: "0.75rem 1rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  maxWidth: "540px",
                }}
              >
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Sparkles size={14} color="#facc15" /> VIRAL SHARE:
                </span>

                {/* WhatsApp Share */}
                <button
                  onClick={() => {
                    const msg = `🎬 Watch & Download *${movie.title}* (${movie.releaseYear}) in 4K Ultra HD on FILMVORA! 🍿\nDirect Link: ${window.location.href}`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  style={{
                    background: "#25D366",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.35rem 0.7rem",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </button>

                {/* Telegram Share */}
                <button
                  onClick={() => {
                    const msg = `🎬 Watch & Download ${movie.title} (${movie.releaseYear}) in 4K on FILMVORA! 🍿`;
                    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  style={{
                    background: "#0088cc",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.35rem 0.7rem",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <Send size={14} />
                  <span>Telegram</span>
                </button>

                {/* Join Channel */}
                <a
                  href="https://t.me/filmvora_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.78rem",
                    color: "#38bdf8",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    textDecoration: "none",
                    fontWeight: 600,
                    marginLeft: "auto",
                  }}
                >
                  <Send size={12} />
                  <span>Join Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="container" style={{ marginTop: "2.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "3rem",
          }}
          className="movie-details-grid"
        >
          {/* Left Column: Synopsis, Cast, Reviews */}
          <div>
            {/* Storyline */}
            <section style={{ marginBottom: "2.5rem" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                Storyline
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: "1.05rem", lineHeight: 1.7 }}>
                {movie.description}
              </p>
            </section>

            {/* Cast & Crew */}
            <section style={{ marginBottom: "3rem" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem" }}>
                Starring Cast & Crew
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {movie.cast && movie.cast.length > 0 ? (
                  movie.cast.map((actor, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-subtle)",
                        padding: "0.5rem 1rem",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <User size={16} color="var(--primary)" />
                      <span>{actor}</span>
                    </div>
                  ))
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>Cast information available in studio release.</span>
                )}
              </div>
            </section>

            {/* Audience Reviews & Rating Form */}
            <section style={{ marginBottom: "3.5rem" }}>
              <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MessageSquare size={20} color="var(--primary)" />
                  <span>Audience Reviews ({reviews.length})</span>
                </h3>
              </div>

              {/* Add Review Box */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <h4 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
                  Leave Your Rating & Review
                </h4>

                <form onSubmit={handleReviewSubmit}>
                  {/* Rating Selector */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Your Rating:</span>
                    <select
                      value={userRating}
                      onChange={(e) => setUserRating(Number(e.target.value))}
                      className="form-select"
                      style={{ width: "auto", padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                    >
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} / 10 Stars
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    rows={3}
                    placeholder={
                      isAuthenticated
                        ? "What did you think of the cinematography, performances, and story?"
                        : "Please sign in to write a review"
                    }
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    disabled={!isAuthenticated || submittingReview}
                    className="form-textarea"
                    style={{ marginBottom: "1rem" }}
                  />

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="submit"
                      disabled={!isAuthenticated || submittingReview}
                      className="btn btn-primary btn-sm"
                    >
                      {submittingReview ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                      <span>Submit Review</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Reviews List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {reviews.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    No reviews yet. Be the first to share your thoughts on this movie!
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev._id}
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        padding: "1.25rem",
                      }}
                    >
                      <div className="flex-between" style={{ marginBottom: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <img
                            src={
                              rev.userAvatar ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                            }
                            alt={rev.userName}
                            style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{rev.userName}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <RatingBadge rating={rev.rating} size="sm" />
                      </div>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.925rem", lineHeight: 1.5 }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Sidebar: Meta details */}
          <div>
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem" }}>
                Movie Details
              </h4>

              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Director</span>
                <div style={{ fontWeight: 600, color: "#fff", marginTop: "0.2rem" }}>
                  {movie.director || "Independent Cinema"}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Primary Language</span>
                <div style={{ fontWeight: 600, color: "#fff", marginTop: "0.2rem" }}>
                  {movie.language || "English"}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Genres</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.3rem" }}>
                  {(movie.genres && movie.genres.length > 0 ? movie.genres : [movie.genre]).map((g, idx) => (
                    <span key={idx} className="badge badge-glass" style={{ fontSize: "0.7rem" }}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Streaming Quality</span>
                <div style={{ fontWeight: 600, color: "var(--accent-emerald)", marginTop: "0.2rem" }}>
                  {movie.quality || "4K Ultra HD • 60 FPS"}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Stream Views</span>
                <div style={{ fontWeight: 600, color: "#fff", marginTop: "0.2rem" }}>
                  {(movie.views || 0).toLocaleString()} Plays
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More Like This Row */}
        {related.length > 0 && (
          <div style={{ marginTop: "3rem" }}>
            <MovieRow title="More Like This" movies={related} />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        trailerUrl={movie.trailerUrl}
        title={movie.title}
      />

      {/* Download API Modal */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        movie={movie}
      />
    </div>
  );
};

export default MovieDetailsPage;
