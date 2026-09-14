import React, { useState, useEffect } from "react";
import { genreService } from "../../services/genreService";
import { adminService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { Tags, Plus, Edit2, Trash2, Image, Loader2, X } from "lucide-react";

const AdminGenresPage = () => {
  const { success, error } = useToast();

  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [modalFormData, setModalFormData] = useState({
    name: "",
    description: "",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  });
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState(null);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const res = await genreService.getGenres();
      if (res.success) {
        setGenres(res.genres || []);
      }
    } catch (err) {
      console.error("Error fetching genres:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const openAddModal = () => {
    setEditingGenre(null);
    setModalFormData({
      name: "",
      description: "",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
      featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (genre) => {
    setEditingGenre(genre);
    setModalFormData({
      name: genre.name,
      description: genre.description || "",
      image: genre.image || "",
      featured: Boolean(genre.featured),
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalFormData.name.trim()) {
      error("Genre name is required");
      return;
    }

    setModalSubmitting(true);
    try {
      if (editingGenre) {
        const res = await adminService.updateGenre(editingGenre._id, modalFormData);
        if (res.success) {
          success(`Genre "${modalFormData.name}" updated!`);
          fetchGenres();
          setIsModalOpen(false);
        }
      } else {
        const res = await adminService.createGenre(modalFormData);
        if (res.success) {
          success(`Genre "${modalFormData.name}" created!`);
          fetchGenres();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      error(err.response?.data?.message || "Operation failed.");
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!genreToDelete) return;
    try {
      const res = await adminService.deleteGenre(genreToDelete._id);
      if (res.success) {
        success(`Genre "${genreToDelete.name}" deleted.`);
        setGenres((prev) => prev.filter((g) => g._id !== genreToDelete._id));
      }
    } catch (err) {
      error(err.response?.data?.message || "Failed to delete genre");
    } finally {
      setGenreToDelete(null);
    }
  };

  return (
    <div className="admin-genres-page fade-in">
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
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Categories & Genres</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Manage category taxonomies and thematic collections
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary btn-sm">
          <Plus size={16} /> Add New Genre
        </button>
      </div>

      {/* Genres Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {loading ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem" }}>
            <Loader2 size={36} className="animate-spin" color="var(--primary)" style={{ margin: "0 auto" }} />
          </div>
        ) : (
          genres.map((g) => (
            <div
              key={g._id}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ position: "relative", height: "120px" }}>
                <img
                  src={g.image}
                  alt={g.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, transparent 0%, rgba(10,12,16,0.9) 100%)",
                  }}
                />
                <span
                  className="badge badge-glass"
                  style={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
                >
                  {g.movieCount || 0} Titles
                </span>
              </div>

              <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    {g.name}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                    {g.description || "No description provided."}
                  </p>
                </div>

                <div className="flex-between" style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    slug: /{g.slug}
                  </span>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      onClick={() => openEditModal(g)}
                      className="btn-icon"
                      style={{ width: "32px", height: "32px" }}
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setGenreToDelete(g);
                        setDeleteModalOpen(true);
                      }}
                      className="btn-icon"
                      style={{ width: "32px", height: "32px", color: "#ef4444" }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Genre Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: "480px", padding: "2rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                {editingGenre ? "Edit Category / Genre" : "Add New Category / Genre"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-icon"
                style={{ width: "30px", height: "30px" }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label className="form-label">Genre Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyberpunk"
                  value={modalFormData.name}
                  onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  placeholder="Thematic summary of the genre..."
                  value={modalFormData.description}
                  onChange={(e) => setModalFormData({ ...modalFormData, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Banner Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={modalFormData.image}
                  onChange={(e) => setModalFormData({ ...modalFormData, image: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="btn btn-primary btn-sm"
                >
                  {modalSubmitting ? <Loader2 size={16} className="animate-spin" /> : <span>Save Category</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Genre"
        message={`Are you sure you want to delete the "${genreToDelete?.name}" category?`}
        confirmText="Delete Genre"
      />
    </div>
  );
};

export default AdminGenresPage;
