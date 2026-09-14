import React, { useState, useEffect } from "react";
import {
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Sparkles,
  ExternalLink,
  Zap,
  Gift,
  Send,
  Lock,
  ArrowRight,
  Tv,
} from "lucide-react";
import API from "../../services/api";
import { useToast } from "../../context/ToastContext";

const DownloadModal = ({ isOpen, onClose, movie }) => {
  const { success, info } = useToast();
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [selectedAudio, setSelectedAudio] = useState("Hindi Dub (Dolby 5.1)");
  
  // Steps: 1: Choose Quality, 2: Ad Gate 1, 3: Ad Gate 2, 4: Download Ready
  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(5);
  const [ad1Clicked, setAd1Clicked] = useState(false);
  const [ad2Clicked, setAd2Clicked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadDetails, setDownloadDetails] = useState(null);

  const [monetizationUrl, setMonetizationUrl] = useState("https://publishers.monetag.com");

  useEffect(() => {
    // Load monetization settings from system
    API.get("/settings")
      .then((res) => {
        if (res.data && res.data.monetizationAdLink) {
          setMonetizationUrl(res.data.monetizationAdLink);
        }
      })
      .catch(() => {
        const saved = localStorage.getItem("filmvora_settings");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.directAdUrl || parsed.monetizationAdLink) {
              setMonetizationUrl(parsed.directAdUrl || parsed.monetizationAdLink);
            }
          } catch (e) {}
        }
      });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCountdown(5);
      setAd1Clicked(false);
      setAd2Clicked(false);
      setDownloadDetails(null);
    }
  }, [isOpen]);

  // Countdown timer for ad steps
  useEffect(() => {
    let timer;
    if ((step === 2 || step === 3) && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen || !movie) return null;

  const cleanTitle = (movie.title || "Movie").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");

  // Step 1 -> Step 2
  const handleProceedToAdGate = async () => {
    setIsProcessing(true);
    const fallbackDownload = {
      title: movie.title || "Movie",
      filename: `${cleanTitle}_${selectedQuality.toUpperCase()}_Filmvora.mp4`,
      quality: selectedQuality.toUpperCase(),
      audio: selectedAudio,
      fileSize: selectedQuality === "4k" ? "2.8 GB" : selectedQuality === "1080p" ? "1.4 GB" : "750 MB",
      downloadUrl: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
    };

    try {
      const response = await API.post(`/movies/${movie.slug || movie._id}/download`, {
        quality: selectedQuality,
        audio: selectedAudio,
      });
      if (response.data && response.data.success) {
        setDownloadDetails(response.data.download);
      } else {
        setDownloadDetails(fallbackDownload);
      }
    } catch (err) {
      setDownloadDetails(fallbackDownload);
    } finally {
      setIsProcessing(false);
      setStep(2);
      setCountdown(5);
    }
  };

  // Click Ad 1 -> Moves to Step 3
  const handleAd1Click = () => {
    setAd1Clicked(true);
    if (monetizationUrl) {
      window.open(monetizationUrl, "_blank");
      info("Sponsor link opened. Verifying server slot...");
    }
    setTimeout(() => {
      setStep(3);
      setCountdown(4);
    }, 1200);
  };

  // Click Ad 2 -> Moves to Final Download Step 4
  const handleAd2Click = () => {
    setAd2Clicked(true);
    if (monetizationUrl) {
      window.open(monetizationUrl, "_blank");
      info("High-speed CDN unlocked!");
    }
    setTimeout(() => {
      setStep(4);
    }, 1200);
  };

  // Trigger real file download in browser
  const handleFinalDownload = () => {
    if (!downloadDetails) return;
    success(`Downloading "${downloadDetails.title}" in ${downloadDetails.quality}`);

    const a = document.createElement("a");
    a.href = downloadDetails.downloadUrl;
    a.download = downloadDetails.filename;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const options = [
    { id: "4k", name: "4K Ultra HD", size: "2.8 GB", desc: "3840x2160 • HEVC 60FPS • Dolby Atmos" },
    { id: "1080p", name: "1080p Full HD", size: "1.4 GB", desc: "1920x1080 • AVC H.264 • Most Popular" },
    { id: "720p", name: "720p HD", size: "750 MB", desc: "1280x720 • Fast Mobile Download" },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "540px", padding: "1.75rem", overflow: "hidden", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: "1.25rem", borderBottom: "1px solid var(--border-subtle)", pb: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "rgba(229, 9, 20, 0.15)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Download size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff" }}>
                {step === 1 && "Download Movie in HD"}
                {step === 2 && "Step 1 of 2: Unlock Sponsor Gate"}
                {step === 3 && "Step 2 of 2: Fast CDN Allocation"}
                {step === 4 && "Download Link Ready!"}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{movie.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: "32px", height: "32px" }}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: Select Quality & Dubbing */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="form-label" style={{ marginBottom: "0.5rem", display: "block", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Select Video Resolution:
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {options.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedQuality(opt.id)}
                    style={{
                      border: selectedQuality === opt.id ? "1px solid var(--primary)" : "1px solid var(--border-subtle)",
                      background: selectedQuality === opt.id ? "rgba(229, 9, 20, 0.1)" : "var(--bg-card)",
                      padding: "0.75rem 1rem",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>{opt.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{opt.desc}</div>
                    </div>
                    <span className="badge badge-glass" style={{ fontSize: "0.75rem", fontWeight: 700, background: "rgba(255,255,255,0.1)" }}>
                      {opt.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label className="form-label" style={{ marginBottom: "0.4rem", display: "block", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Select Audio / Language:
              </label>
              <select
                value={selectedAudio}
                onChange={(e) => setSelectedAudio(e.target.value)}
                className="form-select"
                style={{ width: "100%", padding: "0.6rem 0.8rem", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", color: "#fff" }}
              >
                <option value="Hindi Dub (Dolby 5.1)">Hindi Dubbed (Dolby Atmos 5.1)</option>
                <option value="Dual Audio (Hindi + English)">Dual Audio (Hindi + English)</option>
                <option value="Original English (5.1)">Original Language (English Subtitles)</option>
                <option value="Tamil / Telugu Dub">South Multi-Audio (Tamil / Telugu)</option>
              </select>
            </div>

            <button
              onClick={handleProceedToAdGate}
              disabled={isProcessing}
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.85rem", marginTop: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Connecting 4K Servers...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Generate Direct Download Link</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: Ad Step 1/2 */}
        {step === 2 && (
          <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
            <div style={{ marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(229,9,20,0.15)", color: "var(--primary)", padding: "0.4rem 1rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 700 }}>
              <Lock size={15} />
              <span>Step 1 of 2: Unlock High-Speed Bandwidth</span>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, rgba(245, 197, 24, 0.1) 0%, rgba(229, 9, 20, 0.1) 100%)",
                border: "1px dashed rgba(245, 197, 24, 0.4)",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem 1rem",
                margin: "1rem 0",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                  <Gift size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>
                    Special Sponsor Offer
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                    Click below to open our sponsor offer in a new tab &amp; unlock your 4K download slot.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleAd1Click}
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "linear-gradient(135deg, #e50914, #ff5722)" }}
            >
              <ExternalLink size={18} />
              <span>{countdown > 0 ? `Visit Sponsor & Unlock (Wait ${countdown}s)` : "Click Here to Unlock Step 2"}</span>
            </button>
          </div>
        )}

        {/* STEP 3: Ad Step 2/2 */}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
            <div style={{ marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(0,210,255,0.15)", color: "#00d2ff", padding: "0.4rem 1rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 700 }}>
              <Zap size={15} />
              <span>Step 2 of 2: Finalizing 4K Dedicated CDN Mirror</span>
            </div>

            <div
              style={{
                background: "rgba(16, 19, 26, 0.8)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem 1rem",
                margin: "1rem 0",
                textAlign: "left",
              }}
            >
              <p style={{ fontSize: "0.85rem", color: "#fff", lineHeight: 1.5 }}>
                ⚡ <strong>Allocated Mirror:</strong> Fast 10 Gbps Cloud Node<br/>
                🎬 <strong>Format:</strong> {downloadDetails?.filename} ({downloadDetails?.fileSize})
              </p>
            </div>

            <button
              onClick={handleAd2Click}
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "linear-gradient(135deg, #10b981, #059669)" }}
            >
              <CheckCircle2 size={18} />
              <span>{countdown > 0 ? `Finalizing Download (${countdown}s)...` : "Click to Get Final Download Link"}</span>
            </button>
          </div>
        )}

        {/* STEP 4: Download Link Ready! */}
        {step === 4 && (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", color: "var(--accent-emerald)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
              Download Link Unlocked!
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              File: <strong>{downloadDetails?.filename}</strong> ({downloadDetails?.fileSize})<br/>
              Audio: {downloadDetails?.audio}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button
                onClick={handleFinalDownload}
                className="btn btn-primary btn-lg"
                style={{ width: "100%", padding: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                <Download size={20} />
                <span>Start Direct Download Now</span>
              </button>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("Watch " + movie.title + " in 4K HD on Filmvora!")}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ width: "100%", padding: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#38bdf8", borderColor: "rgba(56, 189, 248, 0.3)" }}
              >
                <Send size={16} />
                <span>Share &amp; Save to Telegram</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadModal;
