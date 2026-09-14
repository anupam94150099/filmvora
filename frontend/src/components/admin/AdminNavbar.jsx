import React from "react";
import { Menu, Shield, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = ({ toggleSidebar, title = "Admin Portal" }) => {
  const { user } = useAuth();

  return (
    <header
      style={{
        height: "68px",
        backgroundColor: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "0 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={toggleSidebar}
          className="btn-icon admin-mobile-toggle"
          style={{ display: "none" }}
          aria-label="Toggle Admin Sidebar"
        >
          <Menu size={20} />
        </button>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
          {title}
        </h2>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "0.35rem 0.8rem",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
            alt={user?.name}
            style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }}
          />
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>
            {user?.name || "Administrator"}
          </span>
          <span className="badge badge-red" style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem" }}>
            ADMIN
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
