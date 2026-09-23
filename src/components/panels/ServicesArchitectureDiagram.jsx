import React, { useState } from "react";
import SpotlightCard from "../common/SpotlightCard";

/**
 * ServicesArchitectureDiagram - Interactive 5-Layer Enterprise Tech Architecture Graphic
 * Allows users to inspect layers from UI/UX to cloud deployment with interactive highlights.
 */
export const ServicesArchitectureDiagram = () => {
  const [selectedLayer, setSelectedLayer] = useState(0);

  const layers = [
    {
      id: 0,
      name: "Experience & Interface Layer",
      icon: "fas fa-desktop",
      tech: "React 19 • Next.js • React Native • Tailwind",
      desc: "Pixel-perfect client applications with sub-second page loads, server components, and responsive fluid motion.",
      specs: ["PWA & Native Support", "Lighthouse Score: 98+", "Micro-frontends ready"],
      accent: "#38bdf8",
    },
    {
      id: 1,
      name: "API & Gateway Orchestration",
      icon: "fas fa-network-wired",
      tech: "GraphQL • RESTful APIs • Kong Gateway • WebSockets",
      desc: "High-throughput API gateways handling request throttling, authentication tokens, and bi-directional live sockets.",
      specs: ["Rate Limiting & Caching", "OAuth 2.0 & JWT", "< 15ms Overhead"],
      accent: "var(--pt-primary)",
    },
    {
      id: 2,
      name: "Microservices & Business Core",
      icon: "fas fa-server",
      tech: "Node.js • Python • Go • Distributed Queues",
      desc: "Decoupled domain services designed for fault isolation, horizontal elasticity, and continuous delivery.",
      specs: ["Event-Driven (Kafka / RabbitMQ)", "Stateless Microservices", "99.99% Availability"],
      accent: "var(--pt-accent-cyan)",
    },
    {
      id: 3,
      name: "Data, Cache & AI Pipelines",
      icon: "fas fa-brain",
      tech: "PostgreSQL • Redis • Vector DB • LangChain",
      desc: "Robust relational data stores paired with in-memory caching and vector embeddings for real-time generative AI.",
      specs: ["Sub-Millisecond In-Memory Reads", "ACID Compliance", "Automated Daily Snapshots"],
      accent: "var(--pt-secondary)",
    },
    {
      id: 4,
      name: "Cloud & DevSecOps Foundation",
      icon: "fas fa-shield-alt",
      tech: "AWS • Docker • Kubernetes • Terraform • Zero-Trust WAF",
      desc: "Infrastructure-as-code deployments managed via Kubernetes clusters with automated security posture scans.",
      specs: ["Multi-Region Auto-Scaling", "Automated CI/CD Pipelines", "SOC 2 & ISO Ready"],
      accent: "#10b981",
    },
  ];

  const current = layers[selectedLayer];

  return (
    <section className="py-5" style={{ background: "#0a0e17", color: "#ffffff", position: "relative" }}>
      <div className="container py-lg-5 py-4">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "750px" }}>
          <span
            className="pt-badge-live"
            style={{
              background: "rgba(0, 242, 254, 0.12)",
              color: "var(--pt-accent-cyan)",
              borderColor: "rgba(0, 242, 254, 0.3)",
            }}
          >
            <span className="pt-live-dot" style={{ backgroundColor: "var(--pt-accent-cyan)" }}></span>
            Interactive Technical Blueprint
          </span>
          <h2 className="fw-bold mb-3 display-6 pt-gradient-text-light">
            Our Multi-Tier Enterprise Architecture Stack
          </h2>
          <p className="text-white-50" style={{ fontSize: "1.05rem" }}>
            Click or hover on any layer below to explore how we engineer scalable, secure, and low-latency systems.
          </p>
        </div>

        <div className="row g-5 align-items-center">
          {/* Left Column: Interactive Layer Stack */}
          <div className="col-lg-6">
            <div className="d-flex flex-column gap-3">
              {layers.map((layer, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedLayer(idx)}
                  className="p-3 rounded-4"
                  style={{
                    background:
                      selectedLayer === idx
                        ? "linear-gradient(90deg, rgba(245, 32, 41, 0.2) 0%, rgba(99, 102, 241, 0.15) 100%)"
                        : "rgba(255, 255, 255, 0.04)",
                    border: `1.5px solid ${selectedLayer === idx ? "var(--pt-primary)" : "rgba(255, 255, 255, 0.08)"}`,
                    boxShadow: selectedLayer === idx ? "0 10px 30px rgba(245, 32, 41, 0.25)" : "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: selectedLayer === idx ? "translateX(8px)" : "translateX(0)",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "12px",
                          background: "rgba(255, 255, 255, 0.06)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: layer.accent,
                          fontSize: "1.1rem",
                        }}
                      >
                        <i className={layer.icon}></i>
                      </div>
                      <div>
                        <div className="fw-bold" style={{ fontSize: "1.05rem", color: "#ffffff" }}>
                          {layer.name}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{layer.tech}</div>
                      </div>
                    </div>
                    <i
                      className="fas fa-chevron-right"
                      style={{
                        color: selectedLayer === idx ? "var(--pt-primary)" : "rgba(255,255,255,0.2)",
                        transform: selectedLayer === idx ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                      }}
                    ></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Layer Deep-Dive Spotlight Card */}
          <div className="col-lg-6">
            <SpotlightCard className="p-4 p-md-5 pt-spotlight-card-dark" maxTilt={8}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    padding: "3px 10px",
                    borderRadius: "99px",
                    background: "rgba(245, 32, 41, 0.2)",
                    color: "var(--pt-primary-light)",
                  }}
                >
                  TIER 0{current.id + 1} SPECIFICATION
                </span>
                <span style={{ fontSize: "0.82rem", color: "#34d399", fontWeight: "600" }}>
                  <i className="fas fa-check-circle me-1"></i> ACTIVE & OPTIMIZED
                </span>
              </div>

              <h3 className="fw-bold mb-3 text-white" style={{ fontSize: "1.6rem" }}>
                {current.name}
              </h3>

              <p className="text-white-50 mb-4 lead" style={{ fontSize: "1.02rem", lineHeight: "1.7" }}>
                {current.desc}
              </p>

              <div className="mb-4">
                <div style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", marginBottom: "10px" }}>
                  Technologies & Standards:
                </div>
                <div className="p-3 rounded-3" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "monospace", color: current.accent, fontSize: "0.88rem" }}>
                  {current.tech}
                </div>
              </div>

              <div className="d-flex flex-column gap-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                {current.specs.map((spec, sIdx) => (
                  <div key={sIdx} className="d-flex align-items-center gap-2">
                    <i className="fas fa-bolt" style={{ color: current.accent, fontSize: "0.85rem" }}></i>
                    <span style={{ fontSize: "0.92rem", color: "#e2e8f0", fontWeight: "500" }}>{spec}</span>
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

export default ServicesArchitectureDiagram;

