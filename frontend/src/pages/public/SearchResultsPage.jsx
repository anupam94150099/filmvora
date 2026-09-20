import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { movieService } from "../../services/movieService";
import MovieGrid from "../../components/common/MovieGrid";
import AdSlot from "../../components/common/AdSlot";
import { Search, Filter, SlidersHorizontal, Sparkles, X, Check } from "lucide-react";

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(query);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [selectedContentType, setSelectedContentType] = useState("All");
  const [selectedSort, setSelectedSort] = useState("popularity");
  const [minRating, setMinRating] = useState("");

  useEffect(() => {
    setSearchInput(query);
    const searchMovies = async () => {
      setLoading(true);
      try {
        const params = {
          search: query || undefined,
          genre: selectedGenre !== "All" ? selectedGenre : undefined,
          language: selectedLanguage !== "All" ? selectedLanguage : undefined,
          year: selectedYear !== "All" ? selectedYear : undefined,
          availability: selectedAvailability !== "All" ? selectedAvailability : undefined,
          contentType: selectedContentType !== "All" ? selectedContentType : undefined,
          sort: selectedSort,
          minRating: minRating || undefined,
          limit: 36,
        };

        const res = await movieService.getMovies(params);
        if (res.success) {
          setMovies(res.movies || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [
    query,
    selectedGenre,
    selectedLanguage,
    selectedYear,
    selectedAvailability,
    selectedContentType,
    selectedSort,
    minRating,
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const clearFilters = () => {
    setSelectedGenre("All");
    setSelectedLanguage("All");
    setSelectedYear("All");
    setSelectedAvailability("All");
    setSelectedContentType("All");
    setSelectedSort("popularity");
    setMinRating("");
  };

  const genres = ["All", "Action", "Sci-Fi", "Drama", "Thriller", "Comedy", "Horror", "Romance", "Animation"];
  const languages = ["All", "Hindi", "English", "Telugu", "Tamil", "Korean", "Japanese", "French", "Spanish"];
  const years = ["All", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "1968", "1921"];

  return (
    <div className="search-results-page fade-in" style={{ padding: "2rem 0 5rem" }}>
      <div className="container">
        {/* Search Header */}
        <div style={{ maxWidth: "780px", margin: "0 auto 2.5rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "0.5rem", color: "#fff" }}>
            Universal Movie & TV Search
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
            Search millions of titles, cast members, directors, and find verified where-to-watch OTT options.
          </p>

          <form onSubmit={handleSearchSubmit}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--bg-card)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "var(--radius-full)",
                padding: "0.6rem 1.25rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <Search size={22} color="var(--primary)" style={{ marginRight: "0.75rem" }} />
              <input
                type="text"
                placeholder="Search title, actor, actress, director, keyword (e.g. Avengers, Pushpa, Nolan)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: "1rem",
                  width: "100%",
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: "var(--radius-full)", padding: "0.5rem 1.4rem" }}>
                Search
              </button>
            </div>
          </form>

          {/* Quick Genre Pills */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.4rem", marginTop: "1.25rem" }}>
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                style={{
                  padding: "0.35rem 0.85rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: selectedGenre === g ? "var(--primary)" : "rgba(255, 255, 255, 0.05)",
                  color: selectedGenre === g ? "#fff" : "var(--text-secondary)",
                  border: selectedGenre === g ? "1px solid var(--primary)" : "1px solid var(--border-subtle)",
                  transition: "all 0.15s ease",
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Toolbar Panel */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>
              <SlidersHorizontal size={18} color="var(--primary)" />
              <span>Advanced Search Filters</span>
            </div>

            <button
              onClick={clearFilters}
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                cursor: "pointer",
                background: "none",
                border: "none",
              }}
            >
              Reset Filters
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "1rem",
            }}
          >
            {/* Availability Filter */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Availability Type
              </label>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  color: "#fff",
                  padding: "0.45rem 0.6rem",
                  borderRadius: "var(--radius-xs)",
                  fontSize: "0.85rem",
                }}
              >
                <option value="All">All Content</option>
                <option value="PUBLIC_DOMAIN">Free Legal Stream (Public Domain)</option>
                <option value="CREATIVE_COMMONS">Open Cinema (Creative Commons)</option>
                <option value="EXTERNAL_STREAMING">Available on OTT / Platforms</option>
              </select>
            </div>

            {/* Content Type Filter */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Content Type
              </label>
              <select
                value={selectedContentType}
                onChange={(e) => setSelectedContentType(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  color: "#fff",
                  padding: "0.45rem 0.6rem",
                  borderRadius: "var(--radius-xs)",
                  fontSize: "0.85rem",
                }}
              >
                <option value="All">Movies & TV Series</option>
                <option value="movie">Movies Only</option>
                <option value="tv">TV Shows / Web Series</option>
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Audio / Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  color: "#fff",
                  padding: "0.45rem 0.6rem",
                  borderRadius: "var(--radius-xs)",
                  fontSize: "0.85rem",
                }}
              >
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Release Year Filter */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Release Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  color: "#fff",
                  padding: "0.45rem 0.6rem",
                  borderRadius: "var(--radius-xs)",
                  fontSize: "0.85rem",
                }}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Sort By
              </label>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  color: "#fff",
                  padding: "0.45rem 0.6rem",
                  borderRadius: "var(--radius-xs)",
                  fontSize: "0.85rem",
                }}
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="releaseDate">Release Date</option>
                <option value="title">Title (A to Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info Banner */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
            {query ? `Results for "${query}"` : "Catalog Explore"}{" "}
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 400 }}>
              ({movies.length} titles found)
            </span>
          </h2>
        </div>

        {/* Results Grid */}
        <MovieGrid
          movies={movies}
          loading={loading}
          emptyMessage="No movie found. Try adjusting your query or filter selections."
        />

        {/* Bottom Ad Slot */}
        <AdSlot type="banner" />
      </div>
    </div>
  );
};

export default SearchResultsPage;
