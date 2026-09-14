import React, { useEffect } from "react";
import { X, Film } from "lucide-react";

const TrailerModal = ({ isOpen, onClose, trailerUrl, title }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const directTrailer = trailerUrl || "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "880px", background: "#0b0d13", padding: 0, overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Film size={20} color="var(--primary)" />
            <h3 style={{ fontSize: "1.1rem" }}>Official Trailer: {title}</h3>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            style={{ width: "32px", height: "32px" }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000" }}>
          <video
            src={directTrailer}
            controls
            autoPlay
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
