import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../../services/adminService";
import StatCard from "../../components/admin/StatCard";
import RatingBadge from "../../components/common/RatingBadge";
import {
  Film,
  Users,
  Eye,
  CheckCircle2,
  FileEdit,
  Flame,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Loader2,
  Calendar,
} from "lucide-react";

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error("Error loading admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh" }}>
        <Loader2 size={36} className="animate-spin" color="var(--primary)" />
      </div>
    );
  }

  const { stats = {}, topWatchedMovies = [], recentUsers = [], viewTrends = [] } = data || {};

  return (
    <div className="admin-dashboard-page fade-in">
      {/* Top Banner with Quick Actions */}
      <div
        className="flex-between"
        style={{
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          padding: "1.5rem",
          borderRadius: "var(--radius-md)",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Platform Intelligence</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.2rem" }}>
            Real-time analytics and media asset overview
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link to="/admin/movies/add" className="btn btn-primary btn-sm">
            <Plus size={16} /> Add New Movie
          </Link>
          <Link to="/admin/analytics" className="btn btn-secondary btn-sm">
            <TrendingUp size={16} /> Analytics
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        <StatCard
          title="Total Movies"
          value={stats.totalMovies || 0}
          icon={Film}
          color="var(--primary)"
          subtitle={`${stats.publishedMovies || 0} Published • ${stats.draftMovies || 0} Drafts`}
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews || 0}
          icon={Eye}
          color="var(--accent-cyan)"
          change="+14.2%"
          subtitle="All-time stream plays"
        />
        <StatCard
          title="Registered Users"
          value={stats.totalUsers || 0}
          icon={Users}
          color="var(--accent-emerald)"
          change="+8.5%"
          subtitle={`${stats.regularUsers || 0} Active Subscribers`}
        />
        <StatCard
          title="Trending Titles"
          value={stats.trendingMovies || 0}
          icon={Flame}
          color="var(--accent-amber)"
          subtitle="Featured on main carousel"
        />
      </div>

      {/* Main Grid: Top Streamed & Recent Signups */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "2rem",
          marginBottom: "2.5rem",
        }}
        className="admin-dashboard-grid"
      >
        {/* Most Watched Movies */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
          }}
        >
          <div className="flex-between" style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>Top Streamed Titles</h3>
            <Link to="/admin/movies" style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600 }}>
              View All &rarr;
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {topWatchedMovies.map((movie, idx) => (
              <div
                key={movie._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.6rem 0.75rem",
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <span style={{ fontSize: "0.9rem", fontWeight: 800, color: idx === 0 ? "var(--primary)" : "var(--text-muted)", width: "20px" }}>
                  #{idx + 1}
                </span>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  style={{ width: "40px", aspectRatio: "2/3", borderRadius: "3px", objectFit: "cover" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {movie.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {movie.genre} • {movie.releaseYear}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>
                    {(movie.views || 0).toLocaleString()} plays
                  </div>
                  <RatingBadge rating={movie.rating} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registered Users */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
          }}
        >
          <div className="flex-between" style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>Recent Signups</h3>
            <Link to="/admin/users" style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600 }}>
              Manage Users &rarr;
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {recentUsers.map((u) => (
              <div
                key={u._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  padding: "0.6rem 0.75rem",
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {u.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {u.email}
                  </div>
                </div>
                <span className={`badge ${u.role === "admin" ? "badge-red" : "badge-glass"}`} style={{ fontSize: "0.65rem" }}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
