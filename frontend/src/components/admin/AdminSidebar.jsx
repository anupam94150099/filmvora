import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  PlusCircle,
  Users,
  Tags,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  Shield,
  Send,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/telegram", label: "Telegram Bot & Traffic", icon: Send },
    { to: "/admin/movies", label: "Movies Catalog", icon: Film },
    { to: "/admin/movies/add", label: "Add Movie", icon: PlusCircle },
    { to: "/admin/users", label: "Users Management", icon: Users },
    { to: "/admin/genres", label: "Genres / Categories", icon: Tags },
    { to: "/admin/analytics", label: "Analytics & Trends", icon: BarChart3 },
    { to: "/admin/settings", label: "System Settings", icon: Settings },
  ];

  const getNavLinkClass = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.85rem",
    padding: "0.75rem 1rem",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.9375rem",
    fontWeight: isActive ? 600 : 500,
    color: isActive ? "#ffffff" : "var(--text-secondary)",
    backgroundColor: isActive ? "var(--primary)" : "transparent",
    transition: "all 0.2s ease",
    marginBottom: "0.35rem",
  });

  return (
    <aside
      className={`admin-sidebar ${isOpen ? "open" : ""}`}
      style={{
        width: "260px",
        backgroundColor: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: "1.5rem 1rem",
        zIndex: 90,
      }}
    >
      {/* Brand */}
      <div style={{ marginBottom: "2rem", padding: "0 0.5rem" }}>
        <Link
          to="/admin"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "1.3rem",
            fontWeight: 800,
            color: "#fff",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              background: "linear-gradient(135deg, #ff1a2b, #b30710)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield size={16} color="#fff" />
          </div>
          <span>FILM<span style={{ color: "var(--primary)" }}>VORA</span></span>
        </Link>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", paddingLeft: "2.3rem" }}>
          Admin Management Suite
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              style={getNavLinkClass}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Navigation */}
      <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", marginTop: "1rem" }}>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            marginBottom: "0.25rem",
          }}
        >
          <ExternalLink size={18} />
          <span>Return to Streaming</span>
        </Link>

        <button
          onClick={logout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.9rem",
            color: "#ef4444",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
