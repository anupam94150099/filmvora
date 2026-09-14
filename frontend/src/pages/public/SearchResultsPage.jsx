import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { movieService } from "../../services/movieService";
import MovieGrid from "../../components/common/MovieGrid";
import { Search } from "lucide-react";

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(query);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    setSearchInput(query);
    const searchMovies = async () => {
      setLoading(true);
      try {
        const params = {};
        if (query) params.search = query;
        if (selectedGenre !== "All") params.genre = selectedGenre;

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
  }, [query, selectedGenre]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const genres = ["All", "Action", "Sci-Fi", "Drama", "Thriller", "Comedy", "Horror", "Romance", "Animation"];

  return (
    <div className="search-results-page fade-in" style={{ padding: "2rem 0 5rem" }}>
      <div className="container">
        {/* Search Header */}
        <div style={{ maxWidth: "680px", margin: "0 auto 2.5rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1.25rem" }}>
            Search Filmvora Catalog
          </h1>

          <form onSubmit={handleSearchSubmit}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-full)",
                padding: "0.6rem 1.25rem",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <Search size={20} color="var(--text-muted)" style={{ marginRight: "0.75rem" }} />
              <input
                type="text"
                placeholder="Search movies, genres, actors, directors..."
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
              <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: "var(--radius-full)" }}>
                Search
              </button>
            </div>
          </form>

          {/* Quick Filter Pills */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.25rem" }}>
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                style={{
                  padding: "0.3rem 0.8rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  background: selectedGenre === g ? "var(--primary)" : "var(--bg-secondary)",
                  color: selectedGenre === g ? "#fff" : "var(--text-secondary)",
                  border: "1px solid var(--border-subtle)",
                  cursor: "pointer",
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Results title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
            {query ? `Results for "${query}"` : "All Titles"}
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginLeft: "0.5rem", fontWeight: 400 }}>
              ({movies.length} found)
            </span>
          </h3>
        </div>

        {/* Results Grid */}
        <MovieGrid
          movies={movies}
          loading={loading}
          emptyMessage={`No movies found matching "${query}".`}
        />
      </div>
    </div>
  );
};

export default SearchResultsPage;
