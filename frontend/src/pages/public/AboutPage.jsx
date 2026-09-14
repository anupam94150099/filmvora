import React from "react";
import { Link } from "react-router-dom";
import { Film, ShieldCheck, Zap, Sparkles, Play, Award, Globe, HeartHandshake } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="about-page fade-in" style={{ padding: "3rem 0 5rem" }}>
      <div className="container" style={{ maxWidth: "960px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="badge badge-red" style={{ marginBottom: "0.75rem" }}>OUR MISSION</span>
          <h1 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", fontWeight: 800, marginBottom: "1rem" }}>
            "Stories Worth Watching."
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "680px", margin: "0 auto", lineHeight: 1.6 }}>
            FILMVORA was created with a clear belief: that cinematic art, independent visions, and open-source storytelling deserve a premium, distraction-free home.
          </p>
        </div>

        {/* Pillars Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.75rem",
            marginBottom: "4rem",
          }}
        >
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "2rem",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(229, 9, 20, 0.15)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <Film size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Cinematic Excellence
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Every title in our collection is mastered in crystal-clear High Definition and 4K Ultra HD with uncompromised sound fidelity.
            </p>
          </div>

          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "2rem",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(16, 185, 129, 0.15)",
                color: "var(--accent-emerald)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              100% Legal & Authorized
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              We partner directly with filmmakers, open creative foundations (like Blender Open Projects), and licensed distributors worldwide.
            </p>
          </div>

          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "2rem",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(0, 210, 255, 0.15)",
                color: "var(--accent-cyan)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Next-Gen Architecture
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Built with modern React.js, Express, and high-throughput streaming pipelines for instant playback with zero buffering lag.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <section
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "3rem 2.5rem",
            marginBottom: "3.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "1rem" }}>
            The Filmvora Standard
          </h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "1rem", marginBottom: "1.5rem" }}>
            We reject intrusive bloated ads, predatory subscriptions, and cookie-cutter streaming algorithms. Filmvora is curated by cinema lovers who believe the experience of discovering a movie should be as magical as watching it.
          </p>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "1rem" }}>
            Whether you are exploring independent festival winners, mind-expanding science fiction, or heart-rending dramas, Filmvora is your portal to authentic cinematic artistry.
          </p>
        </section>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link to="/movies" className="btn btn-primary btn-lg">
            <Play size={20} fill="#fff" />
            <span>Start Streaming Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
