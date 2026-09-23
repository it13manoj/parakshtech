import React, { useState } from "react";
import SpotlightCard from "../common/SpotlightCard";

/**
 * AboutInteractiveGraphics - High-Impact Visual Graphic & Innovation Ecosystem
 * Interactive mission/vision tabs, tech convergence diagram, and capability matrix.
 */
export const AboutInteractiveGraphics = () => {
  const [activeTab, setActiveTab] = useState("mission");

  const tabData = {
    mission: {
      title: "Our Mission",
      badge: "Purpose Driven",
      heading: "Democratizing Enterprise-Grade Digital Engineering",
      desc: "To empower global businesses with resilient, scalable, and intelligent software architectures that accelerate growth and eliminate technical limitations.",
      highlights: [
        "100% Type-Safe & Tested Codebases",
        "Sub-Second Response Time Standards",
        "Transparent Sprint Agility",
      ],
      icon: "fas fa-bullseye",
      accent: "var(--pt-primary)",
    },
    vision: {
      title: "Our Vision",
      badge: "Future Ready",
      heading: "Architecting the Next Generation of Cloud & AI Systems",
      desc: "To be the world's most trusted digital engineering partner, renowned for solving mission-critical technological challenges with unmatched velocity and craftsmanship.",
      highlights: [
        "Autonomous Microservice Ecosystems",
        "Applied Generative AI Workflows",
        "Zero-Trust Security by Default",
      ],
      icon: "fas fa-eye",
      accent: "var(--pt-accent-cyan)",
    },
    philosophy: {
      title: "Engineering Philosophy",
      badge: "Craftsmanship",
      heading: "Architecture Before Code. Performance Before Hype.",
      desc: "We don't build temporary fixes. We engineer durable digital assets using modern design systems, clean distributed patterns, and continuous integration.",
      highlights: [
        "Eliminating Technical Debt Early",
        "Data-Driven Architectural Decisions",
        "Customer-Centric UX Design",
      ],
      icon: "fas fa-microchip",
      accent: "var(--pt-secondary)",
    },
  };

  const current = tabData[activeTab];

  return (
    <section className="py-5" style={{ background: "#ffffff", position: "relative" }}>
      <div className="container py-lg-5 py-3">
        {/* Section Heading */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "700px" }}>
          <span className="pt-badge-live">
            <span className="pt-live-dot"></span>
            Strategic DNA
          </span>
          <h2 className="fw-bold mb-3 display-6" style={{ color: "#0f172a" }}>
            The Principles Powering Our Engineering Excellence
          </h2>
          <p className="text-muted" style={{ fontSize: "1.05rem" }}>
            Explore the philosophy, mission, and architectural standards that guide every software platform we build.
          </p>

          {/* Interactive Switcher Tabs */}
          <div className="pt-filter-tabs mt-4">
            <button
              className={`pt-filter-btn ${activeTab === "mission" ? "active" : ""}`}
              onClick={() => setActiveTab("mission")}
            >
              <i className="fas fa-bullseye me-2"></i> Our Mission
            </button>
            <button
              className={`pt-filter-btn ${activeTab === "vision" ? "active" : ""}`}
              onClick={() => setActiveTab("vision")}
            >
              <i className="fas fa-eye me-2"></i> Our Vision
            </button>
            <button
              className={`pt-filter-btn ${activeTab === "philosophy" ? "active" : ""}`}
              onClick={() => setActiveTab("philosophy")}
            >
              <i className="fas fa-microchip me-2"></i> Engineering Philosophy
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Graphic Card Display */}
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <SpotlightCard className="p-4 p-md-5 h-100" maxTilt={6}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "700",
                    padding: "4px 14px",
                    borderRadius: "99px",
                    background: "rgba(245, 32, 41, 0.1)",
                    color: "var(--pt-primary)",
                  }}
                >
                  {current.badge}
                </span>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "rgba(0,0,0,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: current.accent,
                    fontSize: "1.3rem",
                  }}
                >
                  <i className={current.icon}></i>
                </div>
              </div>

              <h3 className="fw-bold mb-3" style={{ color: "#0f172a", fontSize: "1.5rem" }}>
                {current.heading}
              </h3>

              <p className="text-muted mb-4 lead" style={{ fontSize: "1.02rem", lineHeight: "1.75" }}>
                {current.desc}
              </p>

              <div className="d-flex flex-column gap-2 pt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                {current.highlights.map((h, i) => (
                  <div key={i} className="d-flex align-items-center gap-2">
                    <i className="fas fa-check-circle" style={{ color: current.accent, fontSize: "0.95rem" }}></i>
                    <span style={{ fontWeight: "600", color: "#1e293b", fontSize: "0.92rem" }}>{h}</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </div>

          {/* Interactive Visual Ecosystem Infographic */}
          <div className="col-lg-6">
            <SpotlightCard className="p-4 p-md-5 pt-spotlight-card-dark text-start" maxTilt={8}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-white mb-0">
                  <i className="fas fa-network-wired me-2" style={{ color: "var(--pt-primary)" }}></i>
                  ParakshTech Convergence Model
                </h5>
                <span className="badge bg-danger-subtle text-danger" style={{ fontSize: "0.75rem" }}>
                  v3.8 ARCHITECTURE
                </span>
              </div>

              {/* Graphic Flow Nodes */}
              <div className="d-flex flex-column gap-3">
                {[
                  { title: "Frontend & Reactive UX", tag: "React 19 / Flutter", metric: "60-120 FPS", color: "#38bdf8" },
                  { title: "Microservices & Distributed APIs", tag: "Node.js / Python", metric: "< 25ms Latency", color: "#4ade80" },
                  { title: "Cloud Native Orchestration", tag: "AWS / Kubernetes", metric: "99.99% SLA", color: "#facc15" },
                  { title: "Enterprise AI & Data Pipelines", tag: "LLMs / Vector DB", metric: "Real-Time Inference", color: "#c084fc" },
                ].map((node, nIdx) => (
                  <div
                    key={nIdx}
                    className="p-3 rounded-3 d-flex align-items-center justify-content-between"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      transition: "all 0.25s ease",
                    }}
                  >
                    <div>
                      <div className="fw-bold text-white mb-1" style={{ fontSize: "0.95rem" }}>
                        {node.title}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{node.tag}</div>
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        padding: "3px 10px",
                        borderRadius: "6px",
                        background: "rgba(255, 255, 255, 0.1)",
                        color: node.color,
                      }}
                    >
                      {node.metric}
                    </span>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutInteractiveGraphics;

