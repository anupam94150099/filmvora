import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import StatCard from "../../components/admin/StatCard";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Clock,
  Tv,
  Smartphone,
  Monitor,
  Globe,
  Loader2,
} from "lucide-react";

const AdminAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminService.getStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh" }}>
        <Loader2 size={36} className="animate-spin" color="var(--primary)" />
      </div>
    );
  }

  const { stats = {}, genreDistribution = [], viewTrends = [] } = data || {};

  const maxTrendViews = Math.max(...viewTrends.map((t) => t.views), 1);

  return (
    <div className="admin-analytics-page fade-in" style={{ paddingBottom: "4rem" }}>
      {/* Header */}
      <div
        style={{
          marginBottom: "2rem",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          padding: "1.5rem",
          borderRadius: "var(--radius-md)",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Streaming & Audience Analytics</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          In-depth traffic telemetry, viewer retention metrics, and content consumption rates
        </p>
      </div>

      {/* Analytics KPI Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        <StatCard
          title="Total Stream Views"
          value={stats.totalViews || 0}
          icon={Eye}
          color="var(--primary)"
          change="+18.4%"
          subtitle="Aggregated video requests"
        />
        <StatCard
          title="Est. Watch Hours"
          value={Math.floor((stats.totalViews || 0) * 1.6)}
          icon={Clock}
          color="var(--accent-cyan)"
          change="+12.1%"
          subtitle="Hours of streamed content"
        />
        <StatCard
          title="Avg. Viewer Session"
          value="48 mins"
          icon={TrendingUp}
          color="var(--accent-emerald)"
          change="+5.3%"
          subtitle="Per active playback session"
        />
        <StatCard
          title="Global Regions"
          value="42 Countries"
          icon={Globe}
          color="var(--accent-amber)"
          subtitle="Worldwide CDN delivery"
        />
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "2rem",
          marginBottom: "2.5rem",
        }}
        className="analytics-grid"
      >
        {/* Monthly Streams Bar Visualizer */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "1.75rem",
          }}
        >
          <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>Stream Velocity Trend</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Monthly stream requests</p>
            </div>
            <span className="badge badge-emerald">Real-time Telemetry</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "1.2rem",
              height: "220px",
              paddingTop: "2rem",
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: "0.5rem",
            }}
          >
            {viewTrends.map((t, idx) => {
              const heightPercent = Math.round((t.views / maxTrendViews) * 100);
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    height: "100%",
                    justifyContent: "flex-end",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    {t.views}
                  </span>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "44px",
                      height: `${heightPercent}%`,
                      background: idx === viewTrends.length - 1 ? "var(--primary)" : "rgba(229, 9, 20, 0.4)",
                      borderRadius: "4px 4px 0 0",
                      transition: "height 0.5s ease",
                    }}
                  />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                    {t.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Distribution */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "1.75rem",
          }}
        >
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1.25rem" }}>
            Playback Devices
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <div className="flex-between" style={{ fontSize: "0.875rem", marginBottom: "0.4rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Monitor size={16} color="var(--primary)" /> Desktop & Web
                </span>
                <span style={{ fontWeight: 700 }}>52%</span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>
                <div style={{ width: "52%", height: "100%", background: "var(--primary)", borderRadius: "3px" }} />
              </div>
            </div>

            <div>
              <div className="flex-between" style={{ fontSize: "0.875rem", marginBottom: "0.4rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Smartphone size={16} color="var(--accent-cyan)" /> Mobile (iOS & Android)
                </span>
                <span style={{ fontWeight: 700 }}>34%</span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>
                <div style={{ width: "34%", height: "100%", background: "var(--accent-cyan)", borderRadius: "3px" }} />
              </div>
            </div>

            <div>
              <div className="flex-between" style={{ fontSize: "0.875rem", marginBottom: "0.4rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Tv size={16} color="var(--accent-amber)" /> Smart TV & Apple TV
                </span>
                <span style={{ fontWeight: 700 }}>14%</span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>
                <div style={{ width: "14%", height: "100%", background: "var(--accent-amber)", borderRadius: "3px" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
