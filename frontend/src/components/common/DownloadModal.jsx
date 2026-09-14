import React, { useState, useEffect } from "react";
import {
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Sparkles,
  ExternalLink,
  DollarSign,
  Zap,
  Gift,
} from "lucide-react";
import API from "../../services/api";
import { useToast } from "../../context/ToastContext";

const DownloadModal = ({ isOpen, onClose, movie }) => {
  const { success, error, info } = useToast();
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [selectedAudio, setSelectedAudio] = useState("Original English (5.1)");
  const [step, setStep] = useState(1); // 1: Select Quality, 2: Ad Countdown Gateway, 3: Link Ready
  const [countdown, setCountdown] = useState(8);
  const [canDownload, setCanDownload] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadDetails, setDownloadDetails] = useState(null);

  // Admin configurable monetization settings
  const [adConfig, setAdConfig] = useState({
    enabled: true,
    directAdUrl: "https://www.google.com",
    adBannerHeadline: "Special Partner Offer: Premium VPN & Cloud Storage",
    adBannerDescription: "Get 85% Off + 3 Months Free for unlimited ultra-fast streaming and downloads.",
    adBannerButtonText: "Visit Sponsor Offer (Supports Free Downloads)",
    countdownTime: 8,
  });

  useEffect(() => {
    // Read live settings from admin configuration
    const saved = localStorage.getItem("filmvora_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAdConfig({
          enabled: parsed.enableAdGate !== false,
          directAdUrl: parsed.directAdUrl || "https://www.google.com",
          adBannerHeadline: parsed.adBannerHeadline || "Special Partner Offer: Premium VPN & Cloud Storage",
          adBannerDescription: parsed.adBannerDescription || "Click below to unlock high-speed dedicated mirror & support free streaming on FILMVORA.",
          adBannerButtonText: parsed.adBannerButtonText || "Visit Sponsor Offer & Unlock Download",
          countdownTime: parseInt(parsed.adCountdownSeconds, 10) || 8,
        });
      } catch (e) {
        // fallback to defaults
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCountdown(adConfig.countdownTime || 8);
      setCanDownload(false);
      setDownloadDetails(null);
    }
  }, [isOpen, adConfig.countdownTime]);

  // Handle countdown during Step 2 (Ad Gateway)
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (step === 2 && countdown === 0) {
      setCanDownload(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen || !movie) return null;

  // Step 1 -> Step 2: Call Download Verification API and launch Ad Gateway
  const handleProceedToAdGate = async () => {
    setIsProcessing(true);
    try {
      const response = await API.post(`/movies/${movie.slug || movie._id}/download`, {
        quality: selectedQuality,
        audio: selectedAudio,
      });

      if (response.data.success) {
        setDownloadDetails(response.data.download);
        setStep(2); // Move to Ad Gateway
      }
    } catch (err) {
      error("Failed to generate download token via API");
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2 -> Step 3: Trigger Final Download and track monetization
  const handleFinalDownload = () => {
    if (!downloadDetails) return;
    setStep(3);
    success(`Downloading "${downloadDetails.title}" (${downloadDetails.quality})`);

    // Trigger browser file download
    const a = document.createElement("a");
    a.href = downloadDetails.downloadUrl;
    a.download = downloadDetails.filename;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Open monetized ad link in new tab to generate publisher revenue
  const handleOpenSponsoredAd = () => {
    if (adConfig.directAdUrl) {
      window.open(adConfig.directAdUrl, "_blank");
      info("Sponsor page opened. Thank you for supporting Filmvora!");
    }
  };

  const options = [
    { id: "4k", name: "4K Ultra HD", size: "2.4 GB", desc: "3840x2160 • HEVC HDR10 • Ultra Bitrate" },
    { id: "1080p", name: "1080p Full HD", size: "1.2 GB", desc: "1920x1080 • AVC H.264 (Most Popular)" },
    { id: "720p", name: "720p HD", size: "650 MB", desc: "1280x720 • Fast Mobile Download" },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "560px", padding: "2rem", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "8px",
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
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                {step === 1 && "Download 4K Stream"}
                {step === 2 && "Securing High-Speed Link..."}
                {step === 3 && "Download Started!"}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{movie.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: "32px", height: "32px" }}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: Select Quality & Audio */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label className="form-label" style={{ marginBottom: "0.5rem" }}>
                Select Video Resolution:
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {options.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedQuality(opt.id)}
                    style={{
                      border: selectedQuality === opt.id ? "1px solid var(--primary)" : "1px solid var(--border-subtle)",
                      background: selectedQuality === opt.id ? "rgba(229, 9, 20, 0.08)" : "var(--bg-secondary)",
                      padding: "0.85rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "#fff", fontSize: "0.9rem" }}>{opt.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>{opt.desc}</div>
                    </div>
                    <span className="badge badge-glass" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                      {opt.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label className="form-label">Select Audio Track Dubbing:</label>
              <select
                value={selectedAudio}
                onChange={(e) => setSelectedAudio(e.target.value)}
                className="form-select"
              >
                <option value="Original English (5.1)">Original English (5.1 Surround)</option>
                <option value="Hindi Dub (Dolby Atmos)">Hindi Dub (Dolby Atmos)</option>
                <option value="Spanish (Stereo)">Spanish (Stereo)</option>
              </select>
            </div>

            <button
              onClick={handleProceedToAdGate}
              disabled={isProcessing}
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.85rem" }}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Connecting Download API...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Continue to Download Server</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: Monetized Ad Gateway & Countdown */}
        {step === 2 && (
          <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
            {/* Countdown Badge */}
            <div style={{ marginBottom: "1.25rem" }}>
              {!canDownload ? (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(229, 9, 20, 0.15)",
                    color: "var(--primary)",
                    padding: "0.5rem 1.25rem",
                    borderRadius: "var(--radius-full)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    border: "1px solid rgba(229, 9, 20, 0.3)",
                  }}
                >
                  <Loader2 size={16} className="animate-spin" />
                  <span>Direct 4K Link Unlocking in {countdown}s...</span>
                </div>
              ) : (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "var(--accent-emerald)",
                    padding: "0.5rem 1.25rem",
                    borderRadius: "var(--radius-full)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Link Ready! Server Slot Reserved</span>
                </div>
              )}
            </div>

            {/* Monetization Ad Slot 1 (Banner Ad / Sponsor Unit) */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(245, 197, 24, 0.1) 0%, rgba(229, 9, 20, 0.1) 100%)",
                border: "1px dashed rgba(245, 197, 24, 0.4)",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem 1rem",
                marginBottom: "1.25rem",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "12px",
                  background: "var(--bg-card)",
                  padding: "0.1rem 0.4rem",
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  borderRadius: "3px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                SPONSORED AD
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", textAlign: "left", marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "8px",
                    background: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  <Gift size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>
                    {adConfig.adBannerHeadline}
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                    {adConfig.adBannerDescription}
                  </p>
                </div>
              </div>

              {/* Click Sponsor Button (Generates Admin Ad Revenue) */}
              <button
                onClick={handleOpenSponsoredAd}
                className="btn btn-secondary btn-sm"
                style={{
                  width: "100%",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  borderColor: "rgba(245, 197, 24, 0.3)",
                  color: "#f5c518",
                }}
              >
                <ExternalLink size={14} />
                <span>{adConfig.adBannerButtonText}</span>
              </button>
            </div>

            {/* Action Buttons */}
            {canDownload ? (
              <button
                onClick={handleFinalDownload}
                className="btn btn-primary btn-lg"
                style={{ width: "100%", padding: "0.85rem", fontSize: "1rem" }}
              >
                <Download size={20} />
                <span>Start Direct Download ({downloadDetails?.fileSize})</span>
              </button>
            ) : (
              <button
                disabled
                className="btn btn-glass"
                style={{ width: "100%", padding: "0.85rem", opacity: 0.6, cursor: "not-allowed" }}
              >
                <span>Please wait {countdown}s to unlock direct link...</span>
              </button>
            )}
          </div>
        )}

        {/* STEP 3: Download Complete */}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <CheckCircle2 size={54} color="var(--accent-emerald)" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.4rem" }}>
              Download Started!
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Your file <strong>{downloadDetails?.filename}</strong> ({downloadDetails?.fileSize}) is downloading in your browser.
            </p>
            <button onClick={onClose} className="btn btn-primary btn-sm" style={{ width: "100%" }}>
              Done / Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadModal;
