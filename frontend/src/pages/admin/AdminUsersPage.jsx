import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/admin/ConfirmModal";
import Pagination from "../../components/common/Pagination";
import { Users, Search, Shield, User, Trash2, Check, Ban, Loader2 } from "lucide-react";

const AdminUsersPage = () => {
  const { success, error } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        role: roleFilter,
      };
      if (search.trim()) params.search = search.trim();

      const res = await adminService.getUsers(params);
      if (res.success) {
        setUsers(res.users || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.success) {
        success(res.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      error(err.response?.data?.message || "Failed to update role");
    }
  };

  // Status toggle (Active / Disabled)
  const handleStatusToggle = async (user) => {
    try {
      const res = await adminService.toggleUserStatus(user._id);
      if (res.success) {
        success(res.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u))
        );
      }
    } catch (err) {
      error(err.response?.data?.message || "Failed to toggle status");
    }
  };

  // Delete confirm
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      const res = await adminService.deleteUser(userToDelete._id);
      if (res.success) {
        success("User account deleted successfully");
        setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      }
    } catch (err) {
      error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setUserToDelete(null);
    }
  };

  return (
    <div className="admin-users-page fade-in">
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
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Users Management</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Monitor accounts, adjust security roles, and enforce moderation
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            padding: "0.4rem 0.8rem",
            width: "320px",
          }}
        >
          <Search size={16} color="var(--text-muted)" style={{ marginRight: "0.5rem" }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: "0.875rem",
              width: "100%",
            }}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="form-select"
          style={{ width: "auto", minWidth: "140px", padding: "0.45rem 0.8rem", fontSize: "0.85rem" }}
        >
          <option value="all">All Roles</option>
          <option value="user">Standard Users</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Users Table */}
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.02)" }}>
              <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>USER</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>EMAIL ADDRESS</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>ROLE</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>STATUS</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>JOINED</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600, textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: "3rem", textAlign: "center" }}>
                  <Loader2 size={30} className="animate-spin" color="var(--primary)" style={{ margin: "0 auto" }} />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No user accounts found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} style={{ borderBottom: "1px solid var(--border-subtle)" }} className="table-row-hover">
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <img
                        src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                        alt={u.name}
                        style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span style={{ fontWeight: 600, color: "#fff" }}>{u.name}</span>
                    </div>
                  </td>

                  <td style={{ padding: "0.85rem 1rem", color: "var(--text-secondary)" }}>
                    {u.email}
                  </td>

                  <td style={{ padding: "0.85rem 1rem" }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="form-select"
                      style={{
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.75rem",
                        width: "auto",
                        background: u.role === "admin" ? "rgba(229, 9, 20, 0.15)" : "var(--bg-card)",
                        color: u.role === "admin" ? "var(--primary)" : "#fff",
                      }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td style={{ padding: "0.85rem 1rem" }}>
                    <button
                      onClick={() => handleStatusToggle(u)}
                      style={{
                        padding: "0.25rem 0.6rem",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        background: u.isActive ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        color: u.isActive ? "#10b981" : "#ef4444",
                        border: u.isActive ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)",
                        cursor: "pointer",
                      }}
                      title="Click to toggle active/disabled state"
                    >
                      {u.isActive ? "Active" : "Disabled"}
                    </button>
                  </td>

                  <td style={{ padding: "0.85rem 1rem", color: "var(--text-muted)" }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                    <button
                      onClick={() => {
                        setUserToDelete(u);
                        setDeleteModalOpen(true);
                      }}
                      className="btn-icon"
                      style={{ width: "32px", height: "32px", color: "#ef4444" }}
                      title="Delete User"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete the account of "${userToDelete?.name}" (${userToDelete?.email})?`}
        confirmText="Yes, Delete User"
      />
    </div>
  );
};

export default AdminUsersPage;
