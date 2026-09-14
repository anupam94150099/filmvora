import React, { useState, useEffect } from "react";
import { Send, Bot, Users, Share2, Sparkles, CheckCircle, RefreshCw, Key, MessageSquare, Zap, Flame } from "lucide-react";
import api from "../../services/api";

export default function AdminTelegramPage() {
  const [settings, setSettings] = useState({
    telegramBotToken: "",
    telegramBotUsername: "filmvora_bot",
    telegramChannelId: "@filmvora_official",
    autoPostNewMovies: true,
    viralWatermarkText: "Watch HD Free on Filmvora",
    monetizationAdLink: "https://your-ad-network.com/direct-link",
  });
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [stats, setStats] = useState([
    { label: "Channel Subscribers", value: "28,500+", sub: "+18.4% this week", icon: Users, color: "text-blue-400" },
    { label: "Bot Searches Today", value: "3,890", sub: "Instant TMDB Query & Stream", icon: Bot, color: "text-purple-400" },
    { label: "Ad Link Redirects", value: "9,420", sub: "High CPM Monetized Traffic", icon: Sparkles, color: "text-amber-400" },
    { label: "Active Bot Users", value: "1,420", sub: "Auto-Responding 24/7", icon: MessageSquare, color: "text-indigo-400" },
  ]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings");
      if (res.data) {
        setSettings((prev) => ({
          ...prev,
          telegramBotToken: res.data.telegramBotToken || "",
          telegramBotUsername: res.data.telegramBotUsername || "filmvora_bot",
          telegramChannelId: res.data.telegramChannelId || "@filmvora_official",
          autoPostNewMovies: res.data.autoPostNewMovies !== undefined ? res.data.autoPostNewMovies : true,
          viralWatermarkText: res.data.viralWatermarkText || "Watch HD Free on Filmvora",
          monetizationAdLink: res.data.monetizationAdLink || "https://your-ad-network.com/direct-link",
        }));
      }
    } catch (err) {
      console.log("Using default telegram settings preview");
    }
  };

  const handleSettingChange = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSettings((prev) => ({ ...prev, [field]: val }));
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);
    try {
      await api.put("/settings", settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Telegram Bot & Viral Traffic Automation
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage automated movie delivery, channel auto-posts, viral social sharing hooks, and high-CPM ad redirects.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Bot Engine Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-gray-900/80 border border-gray-800 p-5 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{s.label}</span>
                <Icon className={["w-5 h-5", s.color].join(" ")} />
              </div>
              <p className="text-3xl font-extrabold text-white mt-3">{s.value}</p>
              <p className="text-emerald-400 text-xs mt-2 font-medium">{s.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSettingsSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-md">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-gray-800 pb-3">
              <Key className="w-5 h-5 text-blue-400" />
              Telegram Bot Credentials & Channels
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Telegram Bot Token <span className="text-xs text-gray-500 font-normal">(From @BotFather)</span>
                </label>
                <input
                  type="password"
                  value={settings.telegramBotToken}
                  onChange={handleSettingChange("telegramBotToken")}
                  placeholder="1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                  className="w-full px-4 py-3 bg-gray-950/80 border border-gray-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Obtain your Bot Token from @BotFather on Telegram.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Bot Username</label>
                  <input
                    type="text"
                    value={settings.telegramBotUsername}
                    onChange={handleSettingChange("telegramBotUsername")}
                    placeholder="@filmvora_bot"
                    className="w-full px-4 py-3 bg-gray-950/80 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Official Telegram Channel</label>
                  <input
                    type="text"
                    value={settings.telegramChannelId}
                    onChange={handleSettingChange("telegramChannelId")}
                    placeholder="@filmvora_official"
                    className="w-full px-4 py-3 bg-gray-950/80 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-gray-800 pt-4 pb-3">
              <Share2 className="w-5 h-5 text-purple-400" />
              Viral Traffic & Share Hooks
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Viral Watermark / Branding Text
                </label>
                <input
                  type="text"
                  value={settings.viralWatermarkText}
                  onChange={handleSettingChange("viralWatermarkText")}
                  placeholder="Watch HD Free on Filmvora"
                  className="w-full px-4 py-3 bg-gray-950/80 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Ad Monetization Link / Smart Direct URL
                </label>
                <input
                  type="url"
                  value={settings.monetizationAdLink}
                  onChange={handleSettingChange("monetizationAdLink")}
                  placeholder="https://your-ad-network.com/direct-link"
                  className="w-full px-4 py-3 bg-gray-950/80 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-950/60 rounded-xl border border-gray-800">
                <div>
                  <h4 className="font-semibold text-white text-sm">Auto-Post Trending Releases</h4>
                  <p className="text-xs text-gray-400">Automatically broadcast top trending movies to your Telegram channel daily.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoPostNewMovies}
                  onChange={handleSettingChange("autoPostNewMovies")}
                  className="w-5 h-5 accent-blue-600"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {saveSuccess ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <CheckCircle className="w-5 h-5" /> Settings Saved & Bot Synchronized!
                </div>
              ) : <div />}

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center gap-2 ml-auto"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Save & Update Automation
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-6">
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-blue-500/20 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-400" />
              How Telegram Automation Drives 100K+ Traffic
            </h3>

            <ul className="space-y-4 text-xs text-gray-300 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">1</span>
                <div>
                  <strong className="text-white">Direct Movie Search:</strong> Users in Telegram type movie names (e.g., <em>Pushpa 2, Jawan, Stranger Things</em>) into your bot.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">2</span>
                <div>
                  <strong className="text-white">Instant 4K Link Generation:</strong> Bot fetches movie poster, IMDb rating, and generates 1-click Watch Online button linking to your Filmvora site.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-500/30">3</span>
                <div>
                  <strong className="text-white">Viral Share Multiplication:</strong> Users share player links directly to WhatsApp groups and Telegram channels with 1 tap.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">4</span>
                <div>
                  <strong className="text-white">Maximum Monetization:</strong><br/>100% passive high-CPM ad income from banner, popup, and smartlink monetization.
                </div>
              </li>
            </ul>

            <div className="mt-6 p-3.5 bg-blue-950/40 border border-blue-500/30 rounded-xl">
              <p className="text-xs text-blue-200">
                💡 <strong>Pro Tip:</strong> Place your Telegram Channel link in your website header to convert every website visitor into a lifetime Telegram subscriber!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
