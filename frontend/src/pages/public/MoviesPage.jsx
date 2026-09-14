import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { movieService } from "../../services/movieService";
import { genreService } from "../../services/genreService";
import MovieGrid from "../../components/common/MovieGrid";
import Pagination from "../../components/common/Pagination";
import { Search, Filter, RotateCcw, SlidersHorizontal, ChevronDown } from "lucide-react";

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter state
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") || "All");
  const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || "All");
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get("language") || "All");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch Genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await genreService.getGenres();
        if (res.success) {
          setGenres(res.genres || []);
        }
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch Movies based on active filters
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        sort,
      };

      if (search.trim()) params.search = search.trim();
      if (selectedGenre && selectedGenre !== "All") params.genre = selectedGenre;
      if (selectedYear && selectedYear !== "All") params.year = selectedYear;
      if (selectedLanguage && selectedLanguage !== "All") params.language = selectedLanguage;
      if (minRating) params.minRating = minRating;

      const res = await movieService.getMovies(params);
      if (res.success) {
        setMovies(res.movies || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, selectedGenre, selectedYear, selectedLanguage, minRating, sort]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setSelectedGenre("All");
    setSelectedYear("All");
    setSelectedLanguage("All");
    setMinRating("");
    setSort("newest");
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMovies();
  };

  const years = ["All", 2025, 2024, 2023, 2022, 2021, 2020];
  const languages = ["All", "English", "French", "Spanish", "Japanese", "Korean", "German"];

  return (
    <div className="movies-page fade-in" style={{ padding: "2rem 0 5rem" }}>
      <div className="container">
        {/* Page Title & Search Bar */}
        <div
          className="flex-between"
          style={{
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "2rem",
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: "1.5rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Explore Movies</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
              Showing {totalCount} titles in our catalog
            </p>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "0.5rem 1rem",
              width: "100%",
              maxWidth: "380px",
            }}
          >
            <Search size={18} color="var(--text-muted)" style={{ marginRight: "0.6rem" }} />
            <input
              type="text"
              placeholder="Search by title, director, actor..."
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
                width: "100%",
                fontSize: "0.9rem",
              }}
            />
          </form>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "1.25rem",
            marginBottom: "2.5rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            {/* Genre Selector */}
            <select
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setCurrentPage(1);
              }}
              className="form-select"
              style={{ width: "auto", minWidth: "130px", padding: "0.5rem 0.8rem", fontSize: "0.85rem" }}
            >
              <option value="All">All Genres</option>
              {genres.map((g) => (
                <option key={g._id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
              }}
              className="form-select"
              style={{ width: "auto", minWidth: "110px", padding: "0.5rem 0.8rem", fontSize: "0.85rem" }}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y === "All" ? "All Years" : y}
                </option>
              ))}
            </select>

            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                setCurrentPage(1);
              }}
              className="form-select"
              style={{ width: "auto", minWidth: "120px", padding: "0.5rem 0.8rem", fontSize: "0.85rem" }}
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l === "All" ? "All Languages" : l}
                </option>
              ))}
            </select>

            {/* Min Rating */}
            <select
              value={minRating}
              onChange={(e) => {
                setMinRating(e.target.value);
                setCurrentPage(1);
              }}
              className="form-select"
              style={{ width: "auto", minWidth: "120px", padding: "0.5rem 0.8rem", fontSize: "0.85rem" }}
            >
              <option value="">Any Rating</option>
              <option value="8">8.0+ Stars</option>
              <option value="7">7.0+ Stars</option>
              <option value="6">6.0+ Stars</option>
            </select>

            {/* Reset Button */}
            {(search || selectedGenre !== "All" || selectedYear !== "All" || selectedLanguage !== "All" || minRating) && (
              <button
                onClick={resetFilters}
                className="btn btn-glass btn-sm"
                style={{ color: "var(--text-muted)" }}
                title="Reset Filters"
              >
                <RotateCcw size={14} /> Clear Filters
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Sort by:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
              className="form-select"
              style={{ width: "auto", minWidth: "140px", padding: "0.5rem 0.8rem", fontSize: "0.85rem" }}
            >
              <option value="newest">Latest Releases</option>
              <option value="popular">Most Popular</option>
              <option value="topRated">Highest Rated</option>
              <option value="title">Title (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Movies Grid */}
        <MovieGrid
          movies={movies}
          loading={loading}
          emptyMessage="No movies match the specified filter criteria."
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
};

export default MoviesPage;
