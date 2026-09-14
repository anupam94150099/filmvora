import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Bookmark,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  Film,
  Sparkles,
  TrendingUp,
  Layers,
  ChevronDown,
  Loader2,
  Star,
  Globe,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWatchlist } from "../../context/WatchlistContext";
import API from "../../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { watchlist } = useWatchlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Live Instant Search
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced instant search query
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await API.get(`/movies/instant-search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.data.success && Array.isArray(res.data.results)) {
          setSuggestions(res.data.results);
          setShowDropdown(true);
        }
      } catch (err) {
        console.warn("Instant search err:", err.message);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleSelectMovie = (movie) => {
    setShowDropdown(false);
    setSearchQuery("");
    setIsSearchOpen(false);
    navigate(`/movie/${movie.slug || movie._id}`);
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "#ffffff" : "var(--text-secondary)",
    fontWeight: isActive ? 600 : 500,
    fontSize: "0.9375rem",
    position: "relative",
    padding: "0.4rem 0.2rem",
    transition: "color 0.2s ease",
  });

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: isScrolled ? "rgba(10, 12, 16, 0.95)" : "rgba(10, 12, 16, 0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: isScrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", height: "72px", gap: "2rem" }}>
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #ff1a2b, #b30710)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(229, 9, 20, 0.5)",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: "10px solid #ffffff",
                marginLeft: "2px",
              }}
            />
          </div>
          <span style={{ fontWeight: 800 }}>FILM<span style={{ color: "var(--primary)" }}>VORA</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            flex: 1,
          }}
          className="desktop-nav"
        >
          <NavLink to="/" style={navLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/movies" style={navLinkStyle}>
            Movies
          </NavLink>
          <NavLink to="/genres" style={navLinkStyle}>
            Genres
          </NavLink>
          <NavLink to="/movies?trending=true" style={navLinkStyle}>
            Trending
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/watchlist" style={navLinkStyle}>
              Watchlist
            </NavLink>
          )}
        </nav>

        {/* Right Action Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Search Bar / Trigger with Instant Autocomplete */}
          <div style={{ position: "relative" }} ref={searchContainerRef}>
            {isSearchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-full)",
                  padding: "0.25rem 0.75rem",
                  width: "280px",
                }}
              >
                {isSearching ? (
                  <Loader2 size={16} className="animate-spin" color="var(--primary)" style={{ marginRight: "0.4rem" }} />
                ) : (
                  <Search size={16} color="var(--text-muted)" style={{ marginRight: "0.4rem" }} />
                )}
                <input
                  type="text"
                  placeholder="Search any movie in the world..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowDropdown(true);
                  }}
                  autoFocus
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#fff",
                    fontSize: "0.875rem",
                    width: "100%",
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setShowDropdown(false);
                  }}
                  style={{ color: "var(--text-muted)", cursor: "pointer", background: "none", border: "none" }}
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="btn-icon"
                title="Search any movie"
              >
                <Search size={18} />
              </button>
            )}

            {/* Live Instant Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && isSearchOpen && (
              <div
                className="fade-in"
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: 0,
                  width: "360px",
                  maxHeight: "440px",
                  overflowY: "auto",
                  background: "rgba(18, 22, 31, 0.98)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.8)",
                  zIndex: 200,
                  padding: "0.5rem",
                }}
              >
                <div
                  style={{
                    padding: "0.4rem 0.6rem 0.5rem",
                    borderBottom: "1px solid var(--border-subtle)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>INSTANT RESULTS</span>
                  <span style={{ color: "var(--primary)" }}>{suggestions.length} Movies</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.4rem" }}>
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleSelectMovie(item)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.5rem",
                        borderRadius: "var(--radius-xs)",
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Thumbnail */}
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        style={{
                          width: "38px",
                          height: "54px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          flexShrink: 0,
                          backgroundColor: "#1f293d",
                        }}
                      />

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            color: "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginTop: "0.2rem",
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          <span>{item.releaseYear}</span>
                          <span>•</span>
                          <span style={{ color: "#f5c518", display: "flex", alignItems: "center", gap: "0.2rem", fontWeight: 700 }}>
                            <Star size={12} fill="#f5c518" /> {item.rating}
                          </span>
                          <span>•</span>
                          <span style={{ color: "var(--text-secondary)" }}>{item.genre}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View Full Results button */}
                <button
                  onClick={handleSearchSubmit}
                  style={{
                    width: "100%",
                    marginTop: "0.5rem",
                    padding: "0.6rem",
                    background: "rgba(229, 9, 20, 0.15)",
                    color: "var(--primary)",
                    border: "1px solid rgba(229, 9, 20, 0.3)",
                    borderRadius: "var(--radius-xs)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span>See all results for "{searchQuery}"</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Watchlist Quick Button */}
          {isAuthenticated && (
            <Link
              to="/watchlist"
              className="btn-icon"
              style={{ position: "relative" }}
              title="Your Watchlist"
            >
              <Bookmark size={18} />
              {watchlist.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "3px",
                    right: "3px",
                    background: "var(--primary)",
                    color: "#fff",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {watchlist.length}
                </span>
              )}
            </Link>
          )}

          {/* User Profile / Login Dropdown */}
          {isAuthenticated ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(255, 255, 255, 0.08)",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--border-subtle)",
                  cursor: "pointer",
                }}
              >
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt={user?.name}
                  style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                />
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#fff",
                    maxWidth: "90px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  className="user-name-label"
                >
                  {user?.name?.split(" ")[0]}
                </span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "46px",
                    right: 0,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.5rem",
                    minWidth: "210px",
                    boxShadow: "var(--shadow-lg)",
                    zIndex: 110,
                    animation: "fadeIn 0.15s ease-out",
                  }}
                >
                  <div
                    style={{
                      padding: "0.5rem 0.75rem",
                      borderBottom: "1px solid var(--border-subtle)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#fff" }}>
                      {user?.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {user?.email}
                    </div>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.6rem 0.75rem",
                        fontSize: "0.875rem",
                        color: "var(--primary)",
                        borderRadius: "var(--radius-xs)",
                        fontWeight: 600,
                      }}
                    >
                      <Shield size={16} />
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      padding: "0.6rem 0.75rem",
                      fontSize: "0.875rem",
                      color: "var(--text-main)",
                      borderRadius: "var(--radius-xs)",
                    }}
                  >
                    <User size={16} />
                    My Profile
                  </Link>

                  <Link
                    to="/watchlist"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      padding: "0.6rem 0.75rem",
                      fontSize: "0.875rem",
                      color: "var(--text-main)",
                      borderRadius: "var(--radius-xs)",
                    }}
                  >
                    <Bookmark size={16} />
                    Watchlist ({watchlist.length})
                  </Link>

                  <button
                    onClick={logout}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      padding: "0.6rem 0.75rem",
                      fontSize: "0.875rem",
                      color: "#ef4444",
                      borderRadius: "var(--radius-xs)",
                      textAlign: "left",
                      marginTop: "0.3rem",
                      borderTop: "1px solid var(--border-subtle)",
                    }}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="btn-icon mobile-menu-toggle"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          style={{
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
          className="mobile-drawer"
        >
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: "0.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                padding: "0.6rem 1rem",
              }}
            >
              <Search size={18} color="var(--text-muted)" style={{ marginRight: "0.5rem" }} />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  width: "100%",
                }}
              />
            </div>
          </form>

          <NavLink to="/" style={navLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/movies" style={navLinkStyle}>
            Movies Catalog
          </NavLink>
          <NavLink to="/genres" style={navLinkStyle}>
            Browse Genres
          </NavLink>
          <NavLink to="/movies?trending=true" style={navLinkStyle}>
            Trending Now
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/watchlist" style={navLinkStyle}>
                My Watchlist ({watchlist.length})
              </NavLink>
              <NavLink to="/profile" style={navLinkStyle}>
                User Profile
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" style={{ ...navLinkStyle({ isActive: false }), color: "var(--primary)" }}>
                  Admin Control Panel
                </NavLink>
              )}
              <button
                onClick={logout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#ef4444",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  marginTop: "0.5rem",
                }}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Create Free Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
