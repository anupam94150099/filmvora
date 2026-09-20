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
import AdSlot from "../../components/common/AdSlot";
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
  ShieldCheck,
  MessageSquare,
  Send,
  Loader2,
  Share2,
  Download,
  ExternalLink,
  Sparkles,
  Copy,
  ChevronRight,
  Tv,
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
  const [isPlayingOnSite, setIsPlayingOnSite] = useState(false);

  // Review Form state
  const [userRating, setUserRating] = useState(9);
  const [userComment, setUserComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setIsPlayingOnSite(false);
      try {
        const [detailsRes, reviewsRes] = await Promise.all([
          movieService.getMovieByIdOrSlug(id),
          movieService.getReviews(id),
        ]);

        if (detailsRes.success && detailsRes.movie) {
          const m = detailsRes.movie;
          setMovie(m);
          setRelated(m.related || detailsRes.related || []);

          // Set dynamic SEO page title & meta description
          document.title = `${m.title} (${m.releaseYear}) - Where to Watch & Complete Guide | FILMVORA`;

          // Inject JSON-LD Structured Data Schema for Search Engines
          let schemaScript = document.getElementById("movie-jsonld-schema");
          if (!schemaScript) {
            schemaScript = document.createElement("script");
            schemaScript.id = "movie-jsonld-schema";
            schemaScript.type = "application/ld+json";
            document.head.appendChild(schemaScript);
          }
          schemaScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": m.contentType === "tv" ? "TVSeries" : "Movie",
            name: m.title,
            image: m.posterUrl || m.poster,
            description: m.description,
            datePublished: m.releaseDate || String(m.releaseYear),
            director: {
              "@type": "Person",
              name: m.director,
            },
            actor: (m.cast || []).slice(0, 5).map((name) => ({
              "@type": "Person",
              name,
            })),
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: m.rating,
              bestRating: "10",
              ratingCount: m.views || 100,
            },
          });
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
        <h2>No movie found.</h2>
        <p style={{ color: "var(--text-muted)" }}>
          The title you searched for is currently unavailable or has been removed.
        </p>
        <Link to="/movies" className="btn btn-primary">
          Explore All Movies
        </Link>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie._id);
  const isFreeLegal =
    movie.availability === "PUBLIC_DOMAIN" ||
    movie.availability === "CREATIVE_COMMONS" ||
    movie.availability === "LICENSED" ||
    movie.availability === "OWNED";

  const posterImg = movie.posterUrl || movie.poster;
  const bannerImg = movie.bannerUrl || movie.backdrop || posterImg;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: `Discover ${movie.title} on FILMVORA`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      if (success) success("Link copied to clipboard!");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await movieService.addReview(movie._id, {
        rating: userRating,
        comment: userComment,
      });
      if (res.success) {
        setReviews([res.review, ...reviews]);
        setUserComment("");
        if (success) success("Review posted successfully!");
      }
    } catch (err) {
      if (error) error(err.response?.data?.message || "Failed to post review");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="movie-details-page fade-in" style={{ paddingBottom: "4rem" }}>
      {/* Hero Backdrop Showcase */}
      <div
        style={{
          position: "relative",
          minHeight: "65vh",
          display: "flex",
          alignItems: "flex-end",
          paddingBottom: "3rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${bannerImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: "brightness(0.4) saturate(1.1)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(0deg, var(--bg-main) 0%, rgba(10,12,16,0.8) 50%, rgba(10,12,16,0.3) 100%)",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 10, width: "100%" }}>
          {/* Breadcrumb Navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginBottom: "1.25rem",
            }}
          >
            <Link to="/" style={{ color: "var(--text-secondary)" }}>
              Home
            </Link>
            <ChevronRight size={14} />
            <Link to={movie.contentType === "tv" ? "/series" : "/movies"} style={{ color: "var(--text-secondary)" }}>
              {movie.contentType === "tv" ? "TV Series" : "Movies"}
            </Link>
            <ChevronRight size={14} />
            <span style={{ color: "var(--primary)", fontWeight: 600 }}>{movie.title}</span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "2.5rem",
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            {/* Poster Card */}
            <div
              style={{
                width: "240px",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.12)",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <img
                src={posterImg}
                alt={movie.title}
                style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  background: isFreeLegal ? "rgba(16, 185, 129, 0.9)" : "rgba(10, 12, 16, 0.85)",
                  backdropFilter: "blur(4px)",
                  color: "#fff",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  letterSpacing: "0.5px",
                }}
              >
                {isFreeLegal ? "FREE STREAM" : "WHERE TO WATCH"}
              </div>
            </div>

            {/* Movie Info & CTA Buttons */}
            <div style={{ flex: 1, minWidth: "300px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                <RatingBadge rating={movie.rating} size="md" />
                <span className="badge badge-glass">{movie.releaseYear}</span>
                <span className="badge badge-glass">{movie.duration}</span>
                <span className="badge badge-glass">{movie.ageRating || "13+"}</span>
                <span className="badge badge-glass">{movie.quality || "4K UHD"}</span>
              </div>

              <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "0.75rem" }}>
                {movie.title}
              </h1>

              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <div style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "0.75rem" }}>
                  Original: <em>{movie.originalTitle}</em>
                </div>
              )}

              {/* Action CTA Buttons */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                {isFreeLegal && (movie.watchUrl || movie.videoUrl) ? (
                  <button
                    onClick={() => {
                      setIsPlayingOnSite(true);
                      window.scrollTo({ top: 400, behavior: "smooth" });
                    }}
                    className="btn btn-primary"
                    style={{
                      padding: "0.85rem 1.75rem",
                      fontSize: "1rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    }}
                  >
                    <Play size={18} fill="#fff" />
                    <span>Watch Online (Free)</span>
                  </button>
                ) : (
                  <a
                    href="#where-to-watch"
                    className="btn btn-primary"
                    style={{
                      padding: "0.85rem 1.75rem",
                      fontSize: "1rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <ExternalLink size={18} />
                    <span>Where to Watch</span>
                  </a>
                )}

                {/* Trailer Button */}
                {(movie.trailerUrl || movie.trailerEmbed) && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="btn btn-secondary"
                    style={{
                      padding: "0.85rem 1.5rem",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Film size={18} />
                    <span>Official Trailer</span>
                  </button>
                )}

                {/* Download Button (Only for Legal Free Downloads) */}
                {isFreeLegal && movie.downloadUrl && (
                  <button
                    onClick={() => setDownloadModalOpen(true)}
                    className="btn btn-secondary"
                    style={{
                      padding: "0.85rem 1.5rem",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#10b981",
                      borderColor: "rgba(16, 185, 129, 0.4)",
                    }}
                  >
                    <Download size={18} />
                    <span>Download File</span>
                  </button>
                )}

                {/* Watchlist Toggle */}
                <button
                  onClick={() => toggleWatchlist(movie)}
                  className="btn btn-secondary"
                  style={{
                    padding: "0.85rem 1.25rem",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    borderColor: inWatchlist ? "var(--primary)" : "var(--border-subtle)",
                    color: inWatchlist ? "var(--primary)" : "#fff",
                  }}
                >
                  {inWatchlist ? <Check size={18} /> : <Bookmark size={18} />}
                  <span>{inWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="btn-icon"
                  style={{ width: "48px", height: "48px" }}
                  title="Share Movie"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: "2rem" }}>
        {/* Built-in Video Player for Free Legal Titles */}
        {isPlayingOnSite && isFreeLegal && (
          <div
            style={{
              marginBottom: "3rem",
              background: "#000",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.9)",
            }}
          >
            <div
              style={{
                padding: "0.75rem 1.25rem",
                background: "rgba(16, 185, 129, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(16, 185, 129, 0.25)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981", fontWeight: 700, fontSize: "0.9rem" }}>
                <ShieldCheck size={18} />
                <span>Authorized Legal Player (Public Domain / Open License)</span>
              </div>
              <button
                onClick={() => setIsPlayingOnSite(false)}
                style={{ color: "var(--text-muted)", cursor: "pointer", fontSize: "0.85rem", background: "none", border: "none" }}
              >
                Close Player ✕
              </button>
            </div>
            <video
              src={movie.watchUrl || movie.videoUrl}
              controls
              autoPlay
              style={{ width: "100%", maxHeight: "650px", display: "block" }}
            />
          </div>
        )}

        {/* 2-Column Grid: Details & Where to Watch */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
          {/* Left Column: Synopsis, Cast, Metadata */}
          <div>
            <section style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem" }}>Synopsis</h2>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
                {movie.description}
              </p>
            </section>

            {/* Cast & Crew Section */}
            <section style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.25rem" }}>Top Cast & Crew</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "1rem",
                }}
              >
                {movie.castDetails && movie.castDetails.length > 0
                  ? movie.castDetails.slice(0, 6).map((c, i) => (
                      <div
                        key={i}
                        style={{
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "var(--radius-sm)",
                          padding: "0.75rem",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={c.profileUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"}
                          alt={c.name}
                          style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            margin: "0 auto 0.5rem",
                          }}
                        />
                        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {c.character}
                        </div>
                      </div>
                    ))
                  : (movie.cast || []).slice(0, 6).map((actor, i) => (
                      <div
                        key={i}
                        style={{
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "var(--radius-sm)",
                          padding: "0.75rem",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 0.5rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          <User size={24} />
                        </div>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#fff" }}>{actor}</div>
                      </div>
                    ))}
              </div>
            </section>

            {/* Ad Banner Slot inside Movie Page */}
            <AdSlot type="banner" />
          </div>

          {/* Right Column: Where to Watch & Metadata Info Box */}
          <div>
            {/* Where to Watch Card */}
            <div
              id="where-to-watch"
              style={{
                background: "linear-gradient(145deg, rgba(20, 24, 34, 0.9) 0%, rgba(13, 16, 23, 0.95) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "var(--radius-md)",
                padding: "1.5rem",
                marginBottom: "2rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <Tv size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", margin: 0 }}>
                  Where to Watch Legally
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {movie.officialSources && movie.officialSources.length > 0 ? (
                  movie.officialSources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "var(--radius-sm)",
                        textDecoration: "none",
                        color: "#fff",
                        transition: "all var(--transition-fast)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        {src.logoUrl && (
                          <img
                            src={src.logoUrl}
                            alt={src.providerName}
                            style={{ width: "32px", height: "32px", borderRadius: "6px", objectFit: "cover" }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{src.providerName}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {src.price || (src.type === "stream" ? "Subscription" : "Rent / Buy")}
                          </div>
                        </div>
                      </div>
                      <ExternalLink size={16} color="var(--primary)" />
                    </a>
                  ))
                ) : (
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center", padding: "1rem" }}>
                    Availability information is currently being updated for this region.
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: "1rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid var(--border-subtle)",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  textAlign: "center",
                }}
              >
                Powered by official TMDB & JustWatch legal metadata
              </div>
            </div>

            {/* Quick Metadata Box */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "1.5rem",
              }}
            >
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }}>
                Production Details
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "0.875rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Director:</span>
                  <span style={{ fontWeight: 600, color: "#fff" }}>{movie.director || "Acclaimed Director"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Country:</span>
                  <span style={{ fontWeight: 600, color: "#fff" }}>{movie.country || "Global"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Language:</span>
                  <span style={{ fontWeight: 600, color: "#fff" }}>{movie.language || "English"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Content License:</span>
                  <span style={{ fontWeight: 600, color: isFreeLegal ? "#10b981" : "#94a3b8" }}>
                    {movie.availability || "EXTERNAL_STREAMING"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Reviews & Ratings */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.25rem" }}>
            Audience Reviews ({reviews.length})
          </h2>

          {isAuthenticated ? (
            <form
              onSubmit={handleReviewSubmit}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", color: "#fff" }}>
                Leave your Review
              </h4>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Rating (1 to 10):</label>
                <select
                  value={userRating}
                  onChange={(e) => setUserRating(Number(e.target.value))}
                  style={{
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-subtle)",
                    color: "#fff",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} ★
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                rows={3}
                placeholder="Write your thoughts on this movie..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  color: "#fff",
                  padding: "0.75rem",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: "1rem",
                  resize: "vertical",
                }}
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="btn btn-primary"
                style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                padding: "1rem",
                textAlign: "center",
                marginBottom: "2rem",
              }}
            >
              <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
                Sign In
              </Link>{" "}
              to leave a review and rate this movie.
            </div>
          )}

          {reviews.map((rev) => (
            <div
              key={rev._id}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                padding: "1rem 1.25rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <img
                    src={rev.userAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"}
                    alt={rev.userName}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>{rev.userName}</span>
                </div>
                <div style={{ color: "#f5c518", fontWeight: 700, fontSize: "0.85rem" }}>
                  ★ {rev.rating} / 10
                </div>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0 }}>{rev.comment}</p>
            </div>
          ))}
        </section>

        {/* Similar & Recommended Titles */}
        {related.length > 0 && (
          <MovieRow
            title="More Like This"
            subtitle="Explore recommendations and related titles"
            movies={related}
          />
        )}
      </div>

      {/* Official YouTube Trailer Modal */}
      {showTrailer && (movie.trailerUrl || movie.trailerEmbed) && (
        <TrailerModal
          trailerUrl={movie.trailerEmbed || movie.trailerUrl}
          onClose={() => setShowTrailer(false)}
        />
      )}

      {/* Legal Download Modal */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        movie={movie}
      />
    </div>
  );
};

export default MovieDetailsPage;
