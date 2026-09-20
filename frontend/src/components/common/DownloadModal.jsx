import React, { useState } from "react";
import { X, Download, ShieldCheck, ExternalLink, Film, AlertCircle, CheckCircle2 } from "lucide-react";
import { movieService } from "../../services/movieService";

const DownloadModal = ({ isOpen, onClose, movie }) => {
  if (!isOpen || !movie) return null;

  const [quality, setQuality] = useState("1080p");
  const [downloading, setDownloading] = useState(false);
  const [downloadData, setDownloadData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const isLegalDownloadable =
    (movie.availability === "PUBLIC_DOMAIN" ||
      movie.availability === "CREATIVE_COMMONS" ||
      movie.availability === "LICENSED" ||
      movie.availability === "OWNED") &&
    Boolean(movie.downloadUrl || movie.watchUrl);

  const handleStartDownload = async () => {
    setDownloading(true);
    setErrorMsg("");
    try {
      const res = await movieService.requestDownload(movie._id || movie.slug, quality);
      if (res.success && res.download) {
        setDownloadData(res.download);
        // Trigger browser download
        const a = document.createElement("a");
        a.href = res.download.downloadUrl;
        a.download = res.download.filename;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        setErrorMsg(res.message || "Download not available for this title.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Download request failed. Please check legal sources.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(8px)",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #131722 0%, #0a0c10 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "var(--radius-lg)",
          maxWidth: "560px",
          width: "100%",
          padding: "2rem",
          position: "relative",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.8)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            color: "var(--text-secondary)",
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-sm)",
              background: isLegalDownloadable ? "rgba(16, 185, 129, 0.15)" : "rgba(229, 9, 20, 0.15)",
              color: isLegalDownloadable ? "var(--accent-emerald)" : "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLegalDownloadable ? <Download size={24} /> : <Film size={24} />}
          </div>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", margin: 0 }}>
              {isLegalDownloadable ? "Legal File Download" : "Content Availability Guide"}
            </h3>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {movie.title} ({movie.releaseYear})
            </span>
          </div>
        </div>

        {/* Content Body */}
        {isLegalDownloadable ? (
          <div>
            <div
              style={{
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                borderRadius: "var(--radius-sm)",
                padding: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.5rem",
                fontSize: "0.85rem",
                color: "#6ee7b7",
              }}
            >
              <ShieldCheck size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Legally Licensed / Public Domain:</strong> This file is free and authorized for personal offline viewing under open distribution terms.
              </div>
            </div>

            {/* Quality Selector */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                Select Resolution Quality:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                {[
                  { id: "4k", label: "4K Ultra HD", size: "~1.8 GB" },
                  { id: "1080p", label: "1080p Full HD", size: "~950 MB" },
                  { id: "720p", label: "720p HD", size: "~480 MB" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setQuality(opt.id)}
                    style={{
                      padding: "0.75rem 0.5rem",
                      borderRadius: "var(--radius-sm)",
                      border: quality === opt.id ? "2px solid var(--accent-emerald)" : "1px solid rgba(255, 255, 255, 0.1)",
                      background: quality === opt.id ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.03)",
                      color: quality === opt.id ? "#fff" : "var(--text-secondary)",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{opt.label}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{opt.size}</div>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem" }}>
                {errorMsg}
              </div>
            )}

            {downloadData && (
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "var(--radius-sm)",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.3rem" }}>
                  <CheckCircle2 size={18} />
                  Download initiated!
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                  If your browser didn't start the download automatically,{" "}
                  <a href={downloadData.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-cyan)", textDecoration: "underline" }}>
                    click here to direct download
                  </a>.
                </p>
              </div>
            )}

            <button
              onClick={handleStartDownload}
              disabled={downloading}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "0.9rem",
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                border: "none",
              }}
            >
              <Download size={18} />
              <span>{downloading ? "Preparing Legal File..." : `Download ${quality.toUpperCase()} File`}</span>
            </button>
          </div>
        ) : (
          <div>
            <div
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                borderRadius: "var(--radius-sm)",
                padding: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.5rem",
                fontSize: "0.85rem",
                color: "#fca5a5",
              }}
            >
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Copyright Protected Content:</strong> FILMVORA is a legal discovery platform. Unauthorized downloads are not hosted. Please stream or rent this title legally via official providers below.
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.95rem", color: "#fff", marginBottom: "0.75rem", fontWeight: 600 }}>
                Available on Official Streaming & Rental Platforms:
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {movie.officialSources && movie.officialSources.length > 0 ? (
                  movie.officialSources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem 1rem",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "var(--radius-sm)",
                        color: "#fff",
                        textDecoration: "none",
                        transition: "all var(--transition-fast)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {src.logoUrl && (
                          <img
                            src={src.logoUrl}
                            alt={src.providerName}
                            style={{ width: "28px", height: "28px", borderRadius: "4px", objectFit: "cover" }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{src.providerName}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {src.price || (src.type === "stream" ? "Subscription" : src.type === "rent" ? "Rent" : "Watch")}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600 }}>
                        <span>Watch Now</span>
                        <ExternalLink size={14} />
                      </div>
                    </a>
                  ))
                ) : (
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center", padding: "1rem" }}>
                    Availability information is currently being updated for this region.
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ width: "100%", padding: "0.8rem", borderRadius: "var(--radius-sm)", fontWeight: 600 }}
            >
              Close Guide
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadModal;
