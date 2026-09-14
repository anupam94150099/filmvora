import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { Settings, Save, Shield, Server, Check, Loader2, DollarSign, ExternalLink, Megaphone, Clock } from "lucide-react";

const AdminSettingsPage = () => {
  const { success } = useToast();
  const [saving, setSaving] = useState(false);

  // Load existing or default settings
  const getInitialSettings = () => {
    const saved = localStorage.getItem("filmvora_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      platformName: "FILMVORA",
      tagline: "Stories Worth Watching.",
      supportEmail: "support@filmvora.com",
      dmcaEmail: "dmca@filmvora.com",
      defaultQuality: "4K Ultra HD",
      enablePublicRegistrations: true,
      maintenanceMode: false,
      autoApproveReviews: true,
      // Ad Monetization settings
      enableAdGate: true,
      adNetworkName: "Adsterra / Shortlink Direct Monetization",
      directAdUrl: "https://www.google.com",
      adCountdownSeconds: 8,
      adBannerHeadline: "Sponsored: Watch Unlimited High-Speed 4K Cinema & Exclusive Premieres",
      adBannerDescription: "Click below to unlock high-speed dedicated mirror & support free streaming on FILMVORA.",
      adBannerButtonText: "Claim Sponsor Offer & Unlock Download",
      // Telegram Traffic & Viral Sharing
      telegramBotToken: "",
      telegramChannelUrl: "https://t.me/filmvora_official",
      enableTelegramBot: true,
      whatsappShareHeadline: "Watch & Download in 4K Full HD on FILMVORA!",
    };
  };

  const [settings, setSettings] = useState(getInitialSettings);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    localStorage.setItem("filmvora_settings", JSON.stringify(settings));
    setTimeout(() => {
      setSaving(false);
      success("Platform & Ad Monetization configuration updated successfully!");
    }, 500);
  };

  return (
    <div className="admin-settings-page fade-in" style={{ paddingBottom: "4rem" }}>
      {/* Header */}
      <div
        className="flex-between"
        style={{
          marginBottom: "2rem",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          padding: "1.5rem",
          borderRadius: "var(--radius-md)",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>System Configuration</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Global platform parameters, video CDN endpoints, and security switches
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn btn-primary btn-sm"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: "800px" }}>
        {/* Brand & Identity */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "2rem",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Settings size={18} color="var(--primary)" /> Brand & Identity
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Platform Title</label>
              <input
                type="text"
                name="platformName"
                value={settings.platformName}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brand Tagline</label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">General Support Email</label>
              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">DMCA & Legal Notice Email</label>
              <input
                type="email"
                name="dmcaEmail"
                value={settings.dmcaEmail}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Streaming & Video Infrastructure */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "2rem",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Server size={18} color="var(--accent-cyan)" /> Streaming Infrastructure
          </h3>

          <div className="form-group">
            <label className="form-label">Default Streaming Resolution Tier</label>
            <select
              name="defaultQuality"
              value={settings.defaultQuality}
              onChange={handleChange}
              className="form-select"
            >
              <option value="4K Ultra HD">4K Ultra HD (Adaptive Bitrate)</option>
              <option value="1080p Full HD">1080p Full HD (60 FPS)</option>
              <option value="720p HD">720p HD (Data Saver)</option>
            </select>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.9rem" }}>
              <input
                type="checkbox"
                name="cdnCaching"
                checked={settings.cdnCaching}
                onChange={handleChange}
                style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
              />
              <span>Enable Global Edge CDN Asset & Video Caching</span>
            </label>
          </div>
        </div>

        {/* Security & Access Controls */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "2rem",
          }}
        >
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Shield size={18} color="var(--accent-emerald)" /> Access & Security Controls
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.9rem" }}>
              <input
                type="checkbox"
                name="enablePublicRegistrations"
                checked={settings.enablePublicRegistrations}
                onChange={handleChange}
                style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
              />
              <span>Allow new user registrations</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.9rem" }}>
              <input
                type="checkbox"
                name="autoApproveReviews"
                checked={settings.autoApproveReviews}
                onChange={handleChange}
                style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
              />
              <span>Auto-publish user ratings and reviews</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.9rem" }}>
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
              />
              <span style={{ color: settings.maintenanceMode ? "#ef4444" : "inherit" }}>
                Maintenance Mode (Only administrators can access streaming)
              </span>
            </label>
          </div>
        </div>

        {/* Ad Monetization & Download Gateway */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(234, 179, 8, 0.3)",
            borderRadius: "var(--radius-md)",
            padding: "2rem",
            marginTop: "2rem",
          }}
        >
          <div className="flex-between" style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem", color: "#facc15" }}>
              <DollarSign size={20} /> Ad Monetization & Download Gateway (Earnings)
            </h3>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                background: settings.enableAdGate ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                color: settings.enableAdGate ? "#4ade80" : "#f87171",
                fontWeight: 700,
              }}
            >
              {settings.enableAdGate ? "● ACTIVE & MONETIZED" : "● DISABLED"}
            </span>
          </div>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
            Set your direct ad link (Adsterra, Shortlink, Monetag, GPlinks, CPA offer) and timer before users can download movies.
          </p>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.95rem", fontWeight: 600 }}>
              <input
                type="checkbox"
                name="enableAdGate"
                checked={settings.enableAdGate}
                onChange={handleChange}
                style={{ width: "18px", height: "18px", accentColor: "#facc15" }}
              />
              <span>Enable Ad Monetization Gateway on Movie Downloads</span>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <ExternalLink size={14} color="#facc15" /> Monetized Ad URL (Direct Link / Shortlink)
              </label>
              <input
                type="url"
                name="directAdUrl"
                placeholder="e.g. https://singingfiles.com/your-offer or https://gplinks.co/..."
                value={settings.directAdUrl}
                onChange={handleChange}
                className="form-input"
                style={{ borderColor: "rgba(234, 179, 8, 0.4)" }}
              />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.3rem", display: "block" }}>
                Users clicking "Claim Sponsor Offer" in the download popup will open this URL, generating your ad revenue.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Clock size={14} color="#facc15" /> Countdown Timer (Sec)
              </label>
              <input
                type="number"
                name="adCountdownSeconds"
                min="3"
                max="60"
                value={settings.adCountdownSeconds}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Ad Banner Headline</label>
            <input
              type="text"
              name="adBannerHeadline"
              value={settings.adBannerHeadline}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Ad Banner Description</label>
            <textarea
              name="adBannerDescription"
              value={settings.adBannerDescription}
              onChange={handleChange}
              className="form-input"
              rows={2}
              style={{ resize: "vertical" }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ad Sponsor Button Text</label>
            <input
              type="text"
              name="adBannerButtonText"
              value={settings.adBannerButtonText}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Telegram Bot & Viral Traffic Automation */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(0, 136, 204, 0.4)",
            borderRadius: "var(--radius-md)",
            padding: "2rem",
            marginTop: "2rem",
          }}
        >
          <div className="flex-between" style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem", color: "#0088cc" }}>
              <Megaphone size={20} /> Telegram Bot & Viral Traffic Automation (Highest Income)
            </h3>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                background: "rgba(0, 136, 204, 0.2)",
                color: "#38bdf8",
                fontWeight: 700,
              }}
            >
              ● TRAFFIC BOOSTER
            </span>
          </div>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
            Connect your Telegram Bot (created via <strong>@BotFather</strong> on Telegram). When users message your bot, it automatically sends them FILMVORA streaming and monetized download links!
          </p>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.95rem", fontWeight: 600 }}>
              <input
                type="checkbox"
                name="enableTelegramBot"
                checked={settings.enableTelegramBot}
                onChange={handleChange}
                style={{ width: "18px", height: "18px", accentColor: "#0088cc" }}
              />
              <span>Enable Telegram Movie Search Auto-Responder Bot</span>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Telegram Bot Token (from @BotFather)</label>
              <input
                type="text"
                name="telegramBotToken"
                placeholder="e.g. 7123456789:AAHk1_..."
                value={settings.telegramBotToken}
                onChange={handleChange}
                className="form-input"
                style={{ borderColor: "rgba(0, 136, 204, 0.4)" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Telegram Channel / Group Link</label>
              <input
                type="url"
                name="telegramChannelUrl"
                placeholder="https://t.me/your_channel_name"
                value={settings.telegramChannelUrl}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">WhatsApp Viral Share Headline</label>
            <input
              type="text"
              name="whatsappShareHeadline"
              value={settings.whatsappShareHeadline}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
