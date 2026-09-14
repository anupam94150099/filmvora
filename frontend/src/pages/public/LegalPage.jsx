import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Shield, FileText, Copyright, UploadCloud } from "lucide-react";

const LegalPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "privacy";

  const handleTabChange = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };

  const tabs = [
    { key: "privacy", label: "Privacy Policy", icon: Shield },
    { key: "terms", label: "Terms of Service", icon: FileText },
    { key: "copyright", label: "Copyright & DMCA", icon: Copyright },
    { key: "submissions", label: "Content Submissions", icon: UploadCloud },
  ];

  return (
    <div className="legal-page fade-in" style={{ padding: "3rem 0 5rem" }}>
      <div className="container" style={{ maxWidth: "980px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Legal & Compliance Center
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Last updated: September 2026 • Filmvora Platform Terms & Policies
          </p>
        </div>

        {/* Tab Buttons */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            background: "var(--bg-secondary)",
            padding: "0.4rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            marginBottom: "2.5rem",
            overflowX: "auto",
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  background: isActive ? "var(--primary)" : "transparent",
                  color: isActive ? "#fff" : "var(--text-secondary)",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "2.5rem",
            lineHeight: 1.8,
            color: "#cbd5e1",
          }}
        >
          {activeTab === "privacy" && (
            <div>
              <h2 style={{ fontSize: "1.6rem", color: "#fff", marginBottom: "1.25rem" }}>
                Filmvora Privacy Policy
              </h2>
              <p style={{ marginBottom: "1.25rem" }}>
                At Filmvora, your privacy and digital security are fundamental principles. This document outlines the information we collect, how it is safeguarded, and how you retain complete control over your profile data.
              </p>
              <h3 style={{ fontSize: "1.2rem", color: "#fff", margin: "1.5rem 0 0.5rem" }}>
                1. Information We Collect
              </h3>
              <p style={{ marginBottom: "1rem" }}>
                We collect your name, email address, encrypted password hash (via bcrypt), user watchlist preferences, and viewing histories strictly to optimize streaming performance and deliver personalized recommendations.
              </p>
              <h3 style={{ fontSize: "1.2rem", color: "#fff", margin: "1.5rem 0 0.5rem" }}>
                2. Use of Cookies and Session Storage
              </h3>
              <p style={{ marginBottom: "1rem" }}>
                We utilize encrypted JSON Web Tokens stored securely in client storage to maintain active session states and verify administrator permissions. We do not sell user data or cross-site tracking profiles to third-party ad brokers.
              </p>
              <h3 style={{ fontSize: "1.2rem", color: "#fff", margin: "1.5rem 0 0.5rem" }}>
                3. Data Retention and Account Deletion
              </h3>
              <p>
                Users can edit their personal profile at any time or request immediate account purging by contacting privacy@filmvora.com.
              </p>
            </div>
          )}

          {activeTab === "terms" && (
            <div>
              <h2 style={{ fontSize: "1.6rem", color: "#fff", marginBottom: "1.25rem" }}>
                Terms of Service
              </h2>
              <p style={{ marginBottom: "1.25rem" }}>
                By accessing or streaming video content on Filmvora, you agree to comply with these terms of use.
              </p>
              <h3 style={{ fontSize: "1.2rem", color: "#fff", margin: "1.5rem 0 0.5rem" }}>
                1. Authorized Streaming Use
              </h3>
              <p style={{ marginBottom: "1rem" }}>
                All video streams provided on Filmvora are intended for personal, non-commercial entertainment. Scraping, unauthorized redistribution, automated ripping, or reverse-engineering of stream endpoints is strictly prohibited.
              </p>
              <h3 style={{ fontSize: "1.2rem", color: "#fff", margin: "1.5rem 0 0.5rem" }}>
                2. User Conduct & Reviews
              </h3>
              <p style={{ marginBottom: "1rem" }}>
                When leaving public reviews or ratings, users must refrain from hateful speech, harassment, spamming, or posting spoiler descriptions without clear content warnings.
              </p>
              <h3 style={{ fontSize: "1.2rem", color: "#fff", margin: "1.5rem 0 0.5rem" }}>
                3. Service Availability
              </h3>
              <p>
                Filmvora reserves the right to rotate catalog selections or perform scheduled infrastructure upgrades to maintain high-throughput video delivery.
              </p>
            </div>
          )}

          {activeTab === "copyright" && (
            <div>
              <h2 style={{ fontSize: "1.6rem", color: "#fff", marginBottom: "1.25rem" }}>
                Copyright & DMCA Notice Process
              </h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Filmvora strictly respects intellectual property rights. All titles streamed on our platform are hosted under authorized open-source licenses (such as Creative Commons Blender Foundation works), direct filmmaker syndications, or public studio distribution agreements.
              </p>
              <h3 style={{ fontSize: "1.2rem", color: "#fff", margin: "1.5rem 0 0.5rem" }}>
                Filing a Content Grievance / DMCA Notice
              </h3>
              <p style={{ marginBottom: "1rem" }}>
                If you believe a title on Filmvora infringes your copyright, please send an official notice to <strong>dmca@filmvora.com</strong> containing:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
                <li>A description of the copyrighted work claimed to have been infringed.</li>
                <li>The exact URL of the material located on Filmvora.</li>
                <li>Your contact information (name, address, telephone number, and email).</li>
                <li>A statement that you have a good faith belief that the disputed use is not authorized.</li>
                <li>A digital or physical signature of the copyright owner or authorized representative.</li>
              </ul>
              <p>
                Our legal department investigates all complaints and responds within 24 business hours.
              </p>
            </div>
          )}

          {activeTab === "submissions" && (
            <div>
              <h2 style={{ fontSize: "1.6rem", color: "#fff", marginBottom: "1.25rem" }}>
                Independent Content Submission Guidelines
              </h2>
              <p style={{ marginBottom: "1.25rem" }}>
                We welcome independent filmmakers, animation studios, and creative collectives to submit their works for inclusion in the Filmvora Premiere catalog.
              </p>
              <h3 style={{ fontSize: "1.2rem", color: "#fff", margin: "1.5rem 0 0.5rem" }}>
                Submission Criteria
              </h3>
              <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
                <li>Minimum video resolution of 1080p Full HD (4K preferred).</li>
                <li>Stereo or 5.1 Surround Sound audio track.</li>
                <li>Complete ownership or authorization for all music, visual assets, and script elements.</li>
                <li>High-resolution promotional key art (2:3 poster and 16:9 backdrop banner).</li>
              </ul>
              <p>
                Submit your screener links and press kits directly through our <a href="/contact" style={{ color: "var(--primary)", fontWeight: 600 }}>Contact Page</a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
