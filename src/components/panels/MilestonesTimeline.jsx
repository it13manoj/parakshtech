import React from "react";
import SpotlightCard from "../common/SpotlightCard";

export const MilestonesTimeline = () => {
  const milestones = [
    {
      year: "2016",
      title: "Founding & Early R&D",
      desc: "ParakshTech was founded with a mission to deliver clean enterprise software and modern web architectures.",
      icon: "fas fa-flag",
    },
    {
      year: "2019",
      title: "Global Client Expansion",
      desc: "Expanded delivery capacity across international markets, surpassing 200+ commercial production launches.",
      icon: "fas fa-globe-americas",
    },
    {
      year: "2022",
      title: "Cloud & AI Specialization",
      desc: "Established dedicated practices in cloud orchestration, automated DevOps pipelines, and enterprise AI integrations.",
      icon: "fas fa-network-wired",
    },
    {
      year: "2026",
      title: "Next-Gen Digital Systems",
      desc: "Delivering intelligent digital platforms, microservice ecosystems, and mission-critical software solutions.",
      icon: "fas fa-rocket",
    },
  ];

  return (
    <section className="py-5" style={{ background: "#ffffff", position: "relative" }}>
      <div className="container py-lg-5 py-3">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "700px" }}>
          <span className="pt-badge-live">
            <span className="pt-live-dot"></span>
            Growth & Evolution
          </span>
          <h2 className="fw-bold mb-3 display-6" style={{ color: "#0f172a" }}>
            A Decade of Continuous Innovation
          </h2>
          <p className="text-muted" style={{ fontSize: "1.05rem" }}>
            From our early software prototypes to architecting enterprise-grade digital systems worldwide.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {milestones.map((item, idx) => (
            <div key={idx} className="col-lg-3 col-sm-6">
              <SpotlightCard className="p-4 h-100 text-center" maxTilt={6}>
                <div
                  className="mx-auto mb-3"
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(245, 32, 41, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--pt-primary)",
                    fontSize: "1.3rem",
                  }}
                >
                  <i className={item.icon}></i>
                </div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    color: "var(--pt-primary)",
                    marginBottom: "6px",
                  }}
                >
                  {item.year}
                </div>
                <h5 className="fw-bold mb-2" style={{ color: "#0f172a", fontSize: "1.1rem" }}>
                  {item.title}
                </h5>
                <p className="text-muted mb-0" style={{ fontSize: "0.88rem", lineHeight: "1.6" }}>
                  {item.desc}
                </p>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MilestonesTimeline;

