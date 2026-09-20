import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { movieService } from "../../services/movieService";
import { genreService } from "../../services/genreService";
import HeroBanner from "../../components/common/HeroBanner";
import MovieRow from "../../components/common/MovieRow";
import SkeletonHero from "../../components/common/SkeletonCard";
import AdSlot from "../../components/common/AdSlot";
import PremiumModal from "../../components/common/PremiumModal";
import {
  Sparkles,
  TrendingUp,
  Flame,
  Star,
  Compass,
  Play,
  Clapperboard,
  Film,
  Gift,
  Tv,
  Globe2,
  Award,
  Calendar,
  Layers,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [freeStreamMovies, setFreeStreamMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  // Regional & Industry
  const [bollywoodMovies, setBollywoodMovies] = useState([]);
  const [hollywoodMovies, setHollywoodMovies] = useState([]);
  const [southIndianMovies, setSouthIndianMovies] = useState([]);
  const [koreanMovies, setKoreanMovies] = useState([]);
  const [animeMovies, setAnimeMovies] = useState([]);
  const [webSeries, setWebSeries] = useState([]);

  // Genres
  const [actionMovies, setActionMovies] = useState([]);
  const [sciFiMovies, setSciFiMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [thrillerMovies, setThrillerMovies] = useState([]);
  const [romanceMovies, setRomanceMovies] = useState([]);
  const [animationMovies, setAnimationMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);

  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVipOpen, setIsVipOpen] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        const [
          localRes,
          freeRes,
          trendingRes,
          popularRes,
          topRatedRes,
          upcomingRes,
          bollywoodRes,
          hollywoodRes,
          southRes,
          koreanRes,
          animeRes,
          webSeriesRes,
          actionRes,
          sciFiRes,
          horrorRes,
          comedyRes,
          genresRes,
        ] = await Promise.all([
          movieService.getMovies({ limit: 12 }),
          movieService.getCategoryMovies("free-stream"),
          movieService.getCategoryMovies("trending"),
          movieService.getCategoryMovies("popular"),
          movieService.getCategoryMovies("top-rated"),
          movieService.getCategoryMovies("upcoming"),
          movieService.getCategoryMovies("bollywood"),
          movieService.getCategoryMovies("hollywood"),
          movieService.getCategoryMovies("south-indian"),
          movieService.getCategoryMovies("korean"),
          movieService.getCategoryMovies("anime"),
          movieService.getCategoryMovies("web-series"),
          movieService.getCategoryMovies("28"), // Action
          movieService.getCategoryMovies("878"), // Sci-Fi
          movieService.getCategoryMovies("27"), // Horror
          movieService.getCategoryMovies("35"), // Comedy
          genreService.getGenres(),
        ]);

        if (localRes.success) {
          const localList = localRes.movies || [];
          setFeaturedMovies(localList.filter((m) => m.isFeatured).concat(trendingRes.movies?.slice(0, 3) || []));
        }

        if (freeRes.success) setFreeStreamMovies(freeRes.movies || []);
        if (trendingRes.success) setTrendingMovies(trendingRes.movies || []);
        if (popularRes.success) setPopularMovies(popularRes.movies || []);
        if (topRatedRes.success) setTopRatedMovies(topRatedRes.movies || []);
        if (upcomingRes.success) setUpcomingMovies(upcomingRes.movies || []);
        if (bollywoodRes.success) setBollywoodMovies(bollywoodRes.movies || []);
        if (hollywoodRes.success) setHollywoodMovies(hollywoodRes.movies || []);
        if (southRes.success) setSouthIndianMovies(southRes.movies || []);
        if (koreanRes.success) setKoreanMovies(koreanRes.movies || []);
        if (animeRes.success) setAnimeMovies(animeRes.movies || []);
        if (webSeriesRes.success) setWebSeries(webSeriesRes.movies || []);
        if (actionRes.success) setActionMovies(actionRes.movies || []);
        if (sciFiRes.success) setSciFiMovies(sciFiRes.movies || []);
        if (horrorRes.success) setHorrorMovies(horrorRes.movies || []);
        if (comedyRes.success) setComedyMovies(comedyRes.movies || []);
        if (genresRes.success) setGenres(genresRes.genres || []);
      } catch (err) {
        console.error("Error loading home page catalog:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="home-page fade-in" style={{ paddingBottom: "4rem" }}>
      {/* Hero Banner Spotlight */}
      <div className="container" style={{ paddingTop: "1rem" }}>
        {loading ? <SkeletonHero /> : <HeroBanner featuredMovies={featuredMovies} />}
      </div>

      <div className="container">
        {/* 1. Free Legal Streaming Spotlight */}
        <MovieRow
          title="Free to Stream (Public Domain & Open Classics)"
          subtitle="100% legal, high-definition public domain and open-licensed masterpieces to watch instantly"
          movies={freeStreamMovies}
          loading={loading}
          viewAllLink="/free-stream"
        />

        {/* 2. Trending Movies & TV Shows */}
        <MovieRow
          title="Trending This Week"
          subtitle="Top searched and most popular commercial releases across theatres & OTT"
          movies={trendingMovies}
          loading={loading}
          viewAllLink="/trending"
        />

        {/* Ad Slot 1 */}
        <AdSlot type="banner" />

        {/* 3. Popular Blockbusters */}
        <MovieRow
          title="Popular Cinema & Blockbusters"
          subtitle="Global box office hits with complete legal Where-to-Watch OTT streaming guides"
          movies={popularMovies}
          loading={loading}
          viewAllLink="/movies?sort=popularity"
        />

        {/* 4. Top Rated of All Time */}
        <MovieRow
          title="Top Rated Masterpieces"
          subtitle="Critically acclaimed cinema rated 8.0+ on IMDb & TMDB"
          movies={topRatedMovies}
          loading={loading}
          viewAllLink="/top-rated"
        />

        {/* 5. Upcoming Releases */}
        <MovieRow
          title="Upcoming Theatrical & OTT Premieres"
          subtitle="Official trailers and release countdowns for anticipated films"
          movies={upcomingMovies}
          loading={loading}
          viewAllLink="/upcoming"
        />

        {/* Browse By Genre Cards Hub */}
        <section style={{ marginBottom: "3.5rem" }}>
          <div className="flex-between" style={{ marginBottom: "1.25rem" }}>
            <div>
              <h2 style={{ fontSize: "1.45rem", fontWeight: 700 }}>Browse by Genre</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Curated collections tailored to every emotion and cinematic style
              </p>
            </div>
            <Link to="/genres" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)" }}>
              All Genres &rarr;
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {genres.slice(0, 8).map((genre) => (
              <Link
                key={genre._id}
                to={`/movies?genre=${genre.slug || genre.name}`}
                style={{
                  position: "relative",
                  height: "110px",
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "1rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
                }}
              >
                <img
                  src={genre.image || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80"}
                  alt={genre.name}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.6)",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(0deg, rgba(10,12,16,0.9) 0%, rgba(10,12,16,0.2) 100%)",
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    zIndex: 2,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {genre.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. Regional: Bollywood Cinema */}
        <MovieRow
          title="Bollywood (Hindi Cinema)"
          subtitle="Latest Hindi blockbusters, mass action and critically acclaimed stories"
          movies={bollywoodMovies}
          loading={loading}
          viewAllLink="/movies?language=Hindi"
        />

        {/* 7. Regional: South Indian Cinema */}
        <MovieRow
          title="South Indian Cinema (Telugu, Tamil, Malayalam, Kannada)"
          subtitle="High octane, visionary mass entertainers from South India"
          movies={southIndianMovies}
          loading={loading}
          viewAllLink="/movies?language=Telugu"
        />

        {/* 8. Regional: Hollywood Blockbusters */}
        <MovieRow
          title="Hollywood Blockbusters"
          subtitle="Worldwide studio spectacles, Marvel, DC, and sci-fi franchises"
          movies={hollywoodMovies}
          loading={loading}
          viewAllLink="/movies?language=English"
        />

        {/* 9. Regional: Korean Drama & Cinema */}
        <MovieRow
          title="Korean Drama & Cinema (K-Wave)"
          subtitle="Gripping K-dramas, emotional thrillers and romantic series"
          movies={koreanMovies}
          loading={loading}
          viewAllLink="/movies?language=Korean"
        />

        {/* 10. Regional: Japanese Anime & Animation */}
        <MovieRow
          title="Japanese Anime & Animation"
          subtitle="Visually stunning anime features, Studio Ghibli, shonen, and fantasy"
          movies={animeMovies}
          loading={loading}
          viewAllLink="/movies?genre=Animation"
        />

        {/* 11. Web Series & TV Shows */}
        <MovieRow
          title="Web Series & TV Shows"
          subtitle="Top rated binge-worthy television shows across all streaming platforms"
          movies={webSeries}
          loading={loading}
          viewAllLink="/series"
        />

        {/* 12. Genre Specific Rows */}
        <MovieRow
          title="Action & High-Adrenaline"
          subtitle="Stunts, martial arts, tactical combat and heroic rescues"
          movies={actionMovies}
          loading={loading}
          viewAllLink="/movies?genre=Action"
        />

        <MovieRow
          title="Sci-Fi & Cyberpunk"
          subtitle="Deep space, artificial intelligence, time-travel and multiverses"
          movies={sciFiMovies}
          loading={loading}
          viewAllLink="/movies?genre=Sci-Fi"
        />

        <MovieRow
          title="Horror & Supernatural"
          subtitle="Paranormal dread, haunted folklore, and spine-chilling suspense"
          movies={horrorMovies}
          loading={loading}
          viewAllLink="/movies?genre=Horror"
        />

        <MovieRow
          title="Comedy & Satire"
          subtitle="Laughs, feel-good family misadventures and witty parody"
          movies={comedyMovies}
          loading={loading}
          viewAllLink="/movies?genre=Comedy"
        />

        {/* VIP Premium Promotional Banner */}
        <section
          style={{
            margin: "3.5rem 0 1rem",
            padding: "2.5rem 2rem",
            background: "linear-gradient(135deg, rgba(229, 9, 20, 0.15) 0%, rgba(20, 24, 34, 0.95) 100%)",
            border: "1px solid rgba(229, 9, 20, 0.3)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div style={{ maxWidth: "600px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "var(--primary)",
                color: "#fff",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.2rem 0.6rem",
                borderRadius: "var(--radius-full)",
                marginBottom: "0.75rem",
              }}
            >
              <Sparkles size={14} /> VIP PASS
            </span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>
              Experience Cinema without Limits
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Upgrade to FILMVORA VIP for 100% ad-free exploration, 4K bitrate streaming for open classics, and unlimited cloud watchlists.
            </p>
          </div>

          <button
            onClick={() => setIsVipOpen(true)}
            className="btn btn-primary"
            style={{
              padding: "0.9rem 2rem",
              fontSize: "1rem",
              fontWeight: 700,
              borderRadius: "var(--radius-sm)",
              boxShadow: "0 0 25px rgba(229, 9, 20, 0.5)",
            }}
          >
            Upgrade to VIP Pass
          </button>
        </section>
      </div>

      <PremiumModal isOpen={isVipOpen} onClose={() => setIsVipOpen(false)} />
    </div>
  );
};

export default HomePage;
