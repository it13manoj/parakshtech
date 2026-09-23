import React from "react";
import SpotlightCard from "../common/SpotlightCard";

/**
 * CareerPerksGraphics - Visual Culture & Perks Grid for Careers Page
 * 3D tilt cards, glowing icon accents, and talent value propositions.
 */
export const CareerPerksGraphics = () => {
  const perks = [
    {
      title: "Cutting-Edge Tech Stack",
      desc: "Build with React 19, distributed Node.js microservices, Kubernetes clusters, and applied LLM pipelines.",
      icon: "fas fa-code-branch",
      accent: "var(--pt-primary)",
      badge: "Modern Stack",
    },
    {
      title: "Top-Tier Compensation",
      desc: "Above-market salary packages, bi-annual performance bonuses, and transparent merit-based promotions.",
      icon: "fas fa-coins",
      accent: "#f59e0b",
      badge: "Competitive Pay",
    },
    {
      title: "Remote-First Flexibility",
      desc: "Work from wherever you do your best thinking. Flexible hours with high respect for work-life integration.",
      icon: "fas fa-laptop-house",
      accent: "var(--pt-accent-cyan)",
      badge: "Work Anywhere",
    },
    {
      title: "Continuous Learning Fund",
      desc: "$2,000 annual stipend for developer conferences, cloud certifications (AWS/Azure), and specialized training.",
      icon: "fas fa-graduation-cap",
      accent: "var(--pt-secondary)",
      badge: "Annual Stipend",
    },
    {
      title: "Health & Family Wellness",
      desc: "Comprehensive health insurance covering hospitalization, mental wellness support, and parental leave.",
      icon: "fas fa-heartbeat",
      accent: "#ef4444",
      badge: "Full Coverage",
    },
    {
      title: "Autonomous Ownership",
      desc: "Zero bureaucracy and zero micromanagement. Engineers own feature lifecycles from architecture to production.",
      icon: "fas fa-crown",
      accent: "#10b981",
      badge: "High Autonomy",
    },
  ];

  return (
    <section className="py-5" style={{ background: "#f8fafc", position: "relative" }}>
      <div className="container py-lg-5 py-3">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "720px" }}>
          <span className="pt-badge-live">
            <span className="pt-live-dot"></span>
            Life At ParakshTech
          </span>
          <h2 className="fw-bold mb-3 display-6" style={{ color: "#0f172a" }}>
            Why Exceptional Engineers Choose To Build With Us
          </h2>
          <p className="text-muted" style={{ fontSize: "1.05rem" }}>
            We foster an engineering-led culture where curiosity is celebrated, craft is respected, and impact is recognized.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {perks.map((perk, idx) => (
            <div key={idx} className="col-lg-4 col-md-6">
              <SpotlightCard className="p-4 h-100" maxTilt={8}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: "rgba(0, 0, 0, 0.03)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: perk.accent,
                      fontSize: "1.25rem",
                    }}
                  >
                    <i className={perk.icon}></i>
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      padding: "3px 10px",
                      borderRadius: "99px",
                      background: "rgba(0,0,0,0.05)",
                      color: "#475569",
                    }}
                  >
                    {perk.badge}
                  </span>
                </div>

                <h4 className="fw-bold mb-2" style={{ fontSize: "1.18rem", color: "#0f172a" }}>
                  {perk.title}
                </h4>

                <p className="text-muted mb-0" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
                  {perk.desc}
                </p>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerPerksGraphics;

