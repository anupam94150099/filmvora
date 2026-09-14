import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { movieService } from "../../services/movieService";
import { useWatchlist } from "../../context/WatchlistContext";
import { useToast } from "../../context/ToastContext";
import VideoPlayer from "../../components/common/VideoPlayer";
import DownloadModal from "../../components/common/DownloadModal";
import RatingBadge from "../../components/common/RatingBadge";
import {
  Bookmark,
  Check,
  Share2,
  Eye,
  Calendar,
  Clock,
  Film,
  Download,
  Volume2,
  Tv,
  ArrowLeft,
  Loader2,
  List,
  Send,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const chapters = [
  { time: "00:00", title: "Chapter 1: The Cosmic Anomaly Detected", duration: "24 mins" },
  { time: "24:15", title: "Chapter 2: Subterranean Descent", duration: "38 mins" },
  { time: "62:30", title: "Chapter 3: The Beacon Transmission", duration: "32 mins" },
  { time: "94:45", title: "Chapter 4: Event Horizon Resolution", duration: "26 mins" },
];

const WatchPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { success } = useToast();

  const [movie, setMovie] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudio, setSelectedAudio] = useState("Original (English 5.1)");
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  useEffect(() => {
    const fetchWatchMovie = async () => {
      setLoading(true);
      try {
        const res = await movieService.getMovieByIdOrSlug(id);
        if (res.success) {
          setMovie(res.movie);
          setRelated(res.related || []);
          document.title = `Watching ${res.movie.title} - FILMVORA`;
        }
      } catch (err) {
        console.error("Error loading stream:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchMovie();
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
        <h2>Stream Unavailable</h2>
        <p style={{ color: "var(--text-muted)" }}>
          The requested movie stream is not available or has been removed.
        </p>
        <Link to="/movies" className="btn btn-primary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie._id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success("Movie stream URL copied to clipboard!");
    }
  };

  return (
    <div className="watch-page fade-in" style={{ padding: "1rem 0 5rem" }}>
      <div className="container">
        {/* Back navigation */}
        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={16} /> Back to Details
          </button>
        </div>

        {/* Video Player */}
        <div style={{ marginBottom: "2rem" }}>
          <VideoPlayer
            src={movie.videoUrl}
            poster={movie.backdrop || movie.poster}
            title={movie.title}
            mirrors={movie.streamingMirrors}
          />
        </div>

        {/* Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "2.5rem",
          }}
          className="watch-layout-grid"
        >
          {/* Main Info Column */}
          <div>
            {/* Title & Action Buttons */}
            <div
              className="flex-between"
              style={{
                flexWrap: "wrap",
                gap: "1rem",
                paddingBottom: "1.25rem",
                borderBottom: "1px solid var(--border-subtle)",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <h1 style={{ fontSize: "1.85rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                  {movie.title}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <RatingBadge rating={movie.rating} />
                  <span className="badge badge-glass">{movie.releaseYear}</span>
                  <span className="badge badge-glass">{movie.quality || "4K UHD"}</span>
                  <span className="badge badge-red">{movie.genre}</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Eye size={14} /> {(movie.views || 0).toLocaleString()} views
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => toggleWatchlist(movie)}
                  className="btn btn-glass"
                  style={{ color: inWatchlist ? "var(--primary)" : "#fff" }}
                >
                  {inWatchlist ? <Check size={18} /> : <Bookmark size={18} />}
                  <span>{inWatchlist ? "Saved" : "Save to Watchlist"}</span>
                </button>

                {/* Real Download API trigger */}
                <button
                  onClick={() => setDownloadModalOpen(true)}
                  className="btn btn-primary"
                  title="Download Movie via API"
                >
                  <Download size={18} />
                  <span>Download</span>
                </button>

                <button onClick={handleShare} className="btn btn-icon" title="Share Stream">
                  <Share2 size={18} />
                </button>
              </div>

              {/* 1-Click Viral Share Strip */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  flexWrap: "wrap",
                  marginTop: "1rem",
                  padding: "0.6rem 0.85rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Sparkles size={13} color="#facc15" /> SHARE MOVIE:
                </span>

                <button
                  onClick={() => {
                    const msg = `🍿 Watching *${movie.title}* in 4K on FILMVORA! Watch here: ${window.location.href}`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  style={{
                    background: "#25D366",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.3rem 0.6rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <MessageCircle size={13} />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    const msg = `🍿 Watching ${movie.title} in 4K on FILMVORA!`;
                    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  style={{
                    background: "#0088cc",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.3rem 0.6rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <Send size={13} />
                  <span>Telegram</span>
                </button>

                <a
                  href="https://t.me/filmvora_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.75rem",
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

            {/* Audio Language Switcher */}
            <div
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                padding: "1rem 1.25rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
                <Volume2 size={18} color="var(--accent-cyan)" />
                <span style={{ fontWeight: 600 }}>Audio Track:</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["Original (English 5.1)", "Hindi Dub (Dolby Atmos)", "Spanish (Stereo)"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedAudio(lang);
                      success(`Switched audio to ${lang}`);
                    }}
                    style={{
                      padding: "0.3rem 0.75rem",
                      borderRadius: "var(--radius-xs)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: selectedAudio === lang ? "var(--primary)" : "var(--bg-card)",
                      color: selectedAudio === lang ? "#fff" : "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Storyline */}
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                Synopsis & Plot
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: "1rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                {movie.description}
              </p>

              {/* Chapter Markers */}
              <div style={{ marginTop: "1.5rem" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <List size={16} color="var(--primary)" /> Scene Chapters
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {chapters.map((ch, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        padding: "0.75rem 1rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.85rem",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: "#fff" }}>{ch.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Starts at {ch.time}</div>
                      </div>
                      <span className="badge badge-glass" style={{ fontSize: "0.7rem" }}>{ch.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Up Next Sidebar */}
          <div>
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem",
              }}
            >
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1rem" }}>
                Up Next in Playlist
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                {related.map((rel) => (
                  <div
                    key={rel._id}
                    onClick={() => navigate(`/watch/${rel.slug || rel._id}`)}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      cursor: "pointer",
                      padding: "0.5rem",
                      borderRadius: "var(--radius-sm)",
                      transition: "background 0.2s ease",
                    }}
                    className="related-queue-item"
                  >
                    <img
                      src={rel.poster}
                      alt={rel.title}
                      style={{
                        width: "80px",
                        aspectRatio: "16/9",
                        borderRadius: "var(--radius-xs)",
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "#fff",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {rel.title}
                      </h4>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                        <span>{rel.releaseYear}</span>
                        <span>•</span>
                        <span>{rel.genre}</span>
                      </div>
                      <div style={{ marginTop: "0.3rem" }}>
                        <RatingBadge rating={rel.rating} size="sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download API Modal */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        movie={movie}
      />
    </div>
  );
};

export default WatchPage;
