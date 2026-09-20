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
  Tv,
  Gift,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWatchlist } from "../../context/WatchlistContext";
import API from "../../services/api";
import PremiumModal from "./PremiumModal";

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
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Live Instant Search Autocomplete
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
    fontWeight: isActive ? 700 : 500,
    fontSize: "0.9rem",
    position: "relative",
    padding: "0.4rem 0.2rem",
    transition: "color 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
  });

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: isScrolled ? "rgba(10, 12, 16, 0.96)" : "rgba(10, 12, 16, 0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: isScrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
          transition: "all 0.3s ease",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", height: "72px", gap: "1.5rem" }}>
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "1.45rem",
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#ffffff",
              flexShrink: 0,
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
              gap: "1.2rem",
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
            <NavLink to="/series" style={navLinkStyle}>
              <Tv size={15} /> TV Series
            </NavLink>
            <NavLink to="/free-stream" style={navLinkStyle}>
              <Gift size={15} color="#10b981" /> <span style={{ color: "#10b981" }}>Free to Stream</span>
            </NavLink>
            <NavLink to="/genres" style={navLinkStyle}>
              Genres
            </NavLink>
            <NavLink to="/trending" style={navLinkStyle}>
              Trending
            </NavLink>
            <NavLink to="/top-rated" style={navLinkStyle}>
              Top Rated
            </NavLink>
            <NavLink to="/upcoming" style={navLinkStyle}>
              Upcoming
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/watchlist" style={navLinkStyle}>
                Watchlist
              </NavLink>
            )}
          </nav>

          {/* Right Action Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexShrink: 0 }}>
            {/* VIP Upgrade Button */}
            <button
              onClick={() => setIsPremiumModalOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 0.85rem",
                background: "linear-gradient(135deg, rgba(245, 197, 24, 0.15) 0%, rgba(229, 9, 20, 0.2) 100%)",
                border: "1px solid rgba(245, 197, 24, 0.4)",
                borderRadius: "var(--radius-full)",
                color: "#f5c518",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
              className="desktop-nav"
            >
              <Sparkles size={14} />
              <span>VIP PASS</span>
            </button>

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
                    placeholder="Search any title, cast, genre..."
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
                  title="Search movies and series"
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
                    <span>SEARCH SUGGESTIONS</span>
                    <span style={{ color: "var(--primary)" }}>{suggestions.length} Titles</span>
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
                            <span
                              style={{
                                color: item.availability === "PUBLIC_DOMAIN" || item.availability === "CREATIVE_COMMONS" ? "#10b981" : "var(--primary)",
                                fontWeight: 600,
                                fontSize: "0.7rem",
                              }}
                            >
                              {item.availability === "PUBLIC_DOMAIN" ? "FREE STREAM" : "WHERE TO WATCH"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

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
                    <span>View all matching results for "{searchQuery}"</span>
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
                title="Your Watchlist"
                style={{ position: "relative" }}
              >
                <Bookmark size={18} />
                {watchlist.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      background: "var(--primary)",
                      color: "#fff",
                      fontSize: "0.65rem",
                      fontWeight: 800,
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

            {/* User Profile / Admin Menu */}
            {isAuthenticated ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-full)",
                    padding: "0.25rem 0.6rem 0.25rem 0.3rem",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"}
                    alt={user?.name || "User"}
                    style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <ChevronDown size={14} color="var(--text-secondary)" />
                </button>

                {isUserMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      width: "200px",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-lg)",
                      padding: "0.5rem",
                      zIndex: 200,
                    }}
                  >
                    <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--border-subtle)", marginBottom: "0.4rem" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>{user?.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{user?.email}</div>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          color: "#f5c518",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          borderRadius: "var(--radius-xs)",
                        }}
                      >
                        <Shield size={16} /> Admin Portal
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        color: "var(--text-secondary)",
                        fontSize: "0.875rem",
                        borderRadius: "var(--radius-xs)",
                      }}
                    >
                      <User size={16} /> Profile & Library
                    </Link>

                    <button
                      onClick={logout}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        color: "#ef4444",
                        fontSize: "0.875rem",
                        borderRadius: "var(--radius-xs)",
                        cursor: "pointer",
                        marginTop: "0.25rem",
                        borderTop: "1px solid var(--border-subtle)",
                      }}
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Link to="/login" className="btn btn-secondary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}>
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn-icon mobile-menu-toggle"
              style={{ display: "none" }}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            style={{
              padding: "1rem 1.5rem 1.5rem",
              background: "rgba(10, 12, 16, 0.98)",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <NavLink to="/" style={navLinkStyle}>
              Home
            </NavLink>
            <NavLink to="/movies" style={navLinkStyle}>
              Movies
            </NavLink>
            <NavLink to="/series" style={navLinkStyle}>
              <Tv size={15} /> TV Series
            </NavLink>
            <NavLink to="/free-stream" style={navLinkStyle}>
              <Gift size={15} color="#10b981" /> Free to Stream
            </NavLink>
            <NavLink to="/genres" style={navLinkStyle}>
              Genres
            </NavLink>
            <NavLink to="/trending" style={navLinkStyle}>
              Trending
            </NavLink>
            <NavLink to="/top-rated" style={navLinkStyle}>
              Top Rated
            </NavLink>
            <NavLink to="/upcoming" style={navLinkStyle}>
              Upcoming
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/watchlist" style={navLinkStyle}>
                Watchlist ({watchlist.length})
              </NavLink>
            )}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsPremiumModalOpen(true);
              }}
              style={{
                marginTop: "0.5rem",
                padding: "0.6rem",
                background: "linear-gradient(135deg, #f5c518 0%, #e50914 100%)",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "var(--radius-sm)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <Sparkles size={16} />
              <span>Upgrade to VIP Pass</span>
            </button>
          </div>
        )}
      </header>

      {/* VIP Premium Modal */}
      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
    </>
  );
};

export default Navbar;
