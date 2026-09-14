import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useWatchlist } from "../../context/WatchlistContext";
import { useToast } from "../../context/ToastContext";
import API from "../../services/api";
import { User, Mail, Shield, Lock, Bookmark, Calendar, Check, Loader2 } from "lucide-react";

const avatarOptions = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
];

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { watchlist } = useWatchlist();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || avatarOptions[0]);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      error("Name cannot be empty");
      return;
    }

    setUpdatingProfile(true);
    try {
      await updateProfile({ name: name.trim(), avatar });
      success("Profile details updated!");
    } catch (err) {
      error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      error("Please fill in current and new password");
      return;
    }

    if (newPassword.length < 6) {
      error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      error("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await API.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      if (res.data.success) {
        success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (err) {
      error(err.response?.data?.message || "Failed to change password. Check your current password.");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="profile-page fade-in" style={{ padding: "2.5rem 0 5rem" }}>
      <div className="container" style={{ maxWidth: "860px" }}>
        {/* Profile Card Header */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem",
            marginBottom: "2.5rem",
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <img
            src={avatar}
            alt={user?.name}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid var(--primary)",
              boxShadow: "0 0 20px rgba(229, 9, 20, 0.3)",
            }}
          />

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.3rem" }}>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>{user?.name}</h1>
              <span className={`badge ${user?.role === "admin" ? "badge-red" : "badge-emerald"}`}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
              {user?.email}
            </p>

            <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <Bookmark size={15} color="var(--primary)" /> {watchlist.length} Saved in Watchlist
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <Calendar size={15} /> Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : "2025"}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Settings Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="profile-grid">
          {/* Edit Profile Info */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.75rem",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <User size={18} color="var(--primary)" /> Profile Information
            </h3>

            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="form-input"
                  style={{ opacity: 0.6, cursor: "not-allowed" }}
                />
              </div>

              {/* Avatar Selector */}
              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label className="form-label">Choose Avatar</label>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                  {avatarOptions.map((opt, idx) => (
                    <img
                      key={idx}
                      src={opt}
                      alt={`Avatar option ${idx + 1}`}
                      onClick={() => setAvatar(opt)}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        cursor: "pointer",
                        border: avatar === opt ? "2px solid var(--primary)" : "2px solid transparent",
                        opacity: avatar === opt ? 1 : 0.6,
                        transition: "all 0.2s ease",
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="btn btn-primary btn-sm"
                style={{ marginTop: "1rem" }}
              >
                {updatingProfile ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                <span>Save Profile</span>
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.75rem",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Lock size={18} color="var(--primary)" /> Security & Password
            </h3>

            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: "1rem" }}
              >
                {changingPassword ? <Loader2 size={16} className="animate-spin" /> : <span>Update Password</span>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
