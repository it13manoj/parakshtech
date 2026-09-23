import React from "react";
import SpotlightCard from "../common/SpotlightCard";

export const InnovationPillars = () => {
  const pillars = [
    {
      step: "01",
      title: "Architectural Integrity",
      desc: "We write clean, modular, and strictly typed code designed to resist tech debt and scale seamlessly from 1,000 to 10M+ users.",
      icon: "fas fa-cubes",
      accent: "var(--pt-primary)",
      badge: "Zero Tech Debt",
    },
    {
      step: "02",
      title: "Velocity & Agility",
      desc: "Continuous deployment and automated CI/CD pipelines ensure your features reach production in days, not months.",
      icon: "fas fa-bolt",
      accent: "var(--pt-accent-cyan)",
      badge: "Bi-Weekly Sprints",
    },
    {
      step: "03",
      title: "Zero-Trust Security",
      desc: "End-to-end payload encryption, strict access governance, and continuous vulnerability scans protect every endpoint.",
      icon: "fas fa-shield-alt",
      accent: "var(--pt-secondary)",
      badge: "ISO & SOC 2 Ready",
    },
    {
      step: "04",
      title: "Intelligent Automation",
      desc: "Harnessing modern machine learning, predictive analytics, and LLM reasoning to automate labor-intensive digital workflows.",
      icon: "fas fa-brain",
      accent: "#10b981",
      badge: "AI Powered",
    },
  ];

  return (
    <section className="py-5" style={{ background: "#f8fafc", position: "relative" }}>
      <div className="container py-lg-5 py-3">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "720px" }}>
          <span className="pt-badge-live">
            <span className="pt-live-dot"></span>
            Our Foundation
          </span>
          <h2 className="fw-bold mb-3 display-6" style={{ color: "#0f172a" }}>
            The 4 Pillars That Define ParakshTech Engineering
          </h2>
          <p className="text-muted" style={{ fontSize: "1.05rem" }}>
            Every solution we deliver is guided by uncompromising standards of resilience, speed, security, and human-centric design.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="col-lg-3 col-md-6">
              <SpotlightCard className="p-4 h-100" maxTilt={8}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "14px",
                      background: "rgba(0, 0, 0, 0.03)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: pillar.accent,
                      fontSize: "1.3rem",
                    }}
                  >
                    <i className={pillar.icon}></i>
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      padding: "4px 10px",
                      borderRadius: "99px",
                      background: "rgba(0,0,0,0.05)",
                      color: "#475569",
                    }}
                  >
                    {pillar.badge}
                  </span>
                </div>

                <h4 className="fw-bold mb-2" style={{ fontSize: "1.2rem", color: "#0f172a" }}>
                  {pillar.title}
                </h4>

                <p
                  className="text-muted mb-0"
                  style={{ fontSize: "0.9rem", lineHeight: "1.65" }}
                >
                  {pillar.desc}
                </p>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InnovationPillars;

