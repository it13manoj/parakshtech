import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../Config/API";
import SpotlightCard from "../common/SpotlightCard";

// Default portfolio projects covering Web App, Website & Android Application
const defaultProjects = [
  {
    id: 1,
    category: "webapp",
    title: "Enterprise Resource Management",
    sub_heading: "Web Application",
    description:
      "A full-featured ERP platform with real-time dashboards, role-based access control, and seamless third-party API integrations for streamlined business workflows.",
    tech: ["React", "Node.js", "MongoDB", "Redux"],
    icon: "fas fa-laptop-code",
    accentColor: "var(--pt-primary)",
    gradient: "linear-gradient(135deg, #f52029 0%, #ff6b7d 100%)",
    features: ["Real-time Analytics", "Role-based Access", "API Integration"],
    status: "Live",
  },
  {
    id: 2,
    category: "website",
    title: "Corporate Brand Portal",
    sub_heading: "Website",
    description:
      "A pixel-perfect, SEO-optimised corporate website with blazing-fast load times, accessibility-first design, and CMS-powered dynamic content management.",
    tech: ["Next.js", "Tailwind CSS", "Strapi CMS", "Vercel"],
    icon: "fas fa-globe",
    accentColor: "var(--pt-secondary)",
    gradient: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
    features: ["SEO Optimised", "CMS Powered", "Performance 100/100"],
    status: "Live",
  },
  {
    id: 3,
    category: "android",
    title: "Smart Health Tracker",
    sub_heading: "Android Application",
    description:
      "A cross-platform mobile health app with real-time vitals monitoring, push notifications, offline sync, and integration with wearable IoT devices.",
    tech: ["React Native", "Firebase", "Redux", "BLE"],
    icon: "fas fa-mobile-alt",
    accentColor: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    features: ["Offline-First Sync", "IoT Integration", "Push Notifications"],
    status: "Live",
  },
  {
    id: 4,
    category: "webapp",
    title: "FinTech Payment Dashboard",
    sub_heading: "Web Application",
    description:
      "A secure fintech dashboard with multi-currency wallets, real-time transaction streams, fraud detection alerts, and bank-grade encryption protocols.",
    tech: ["Vue.js", "Python", "PostgreSQL", "Stripe API"],
    icon: "fas fa-chart-line",
    accentColor: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    features: ["Multi-Currency", "Fraud Detection", "Bank-Grade Encryption"],
    status: "Live",
  },
  {
    id: 5,
    category: "website",
    title: "E-Commerce Marketplace",
    sub_heading: "Website",
    description:
      "A high-conversion e-commerce platform with AI-powered product recommendations, dynamic pricing engine, and multi-vendor management capabilities.",
    tech: ["React", "GraphQL", "Shopify", "Elasticsearch"],
    icon: "fas fa-shopping-cart",
    accentColor: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
    features: ["AI Recommendations", "Multi-Vendor", "Dynamic Pricing"],
    status: "Live",
  },
  {
    id: 6,
    category: "android",
    title: "Fleet Management App",
    sub_heading: "Android Application",
    description:
      "An enterprise fleet tracking app with live GPS dashboards, driver performance scoring, geofencing alerts, and automated compliance reporting.",
    tech: ["Flutter", "Google Maps SDK", "WebSockets", "AWS"],
    icon: "fas fa-truck",
    accentColor: "#00f2fe",
    gradient: "linear-gradient(135deg, #00f2fe 0%, #38bdf8 100%)",
    features: ["Live GPS Tracking", "Geofencing", "Driver Scoring"],
    status: "Live",
  },
];

const categoryConfig = {
  all: { label: "All Projects", icon: "fas fa-th" },
  webapp: { label: "Web App", icon: "fas fa-laptop-code" },
  website: { label: "Website", icon: "fas fa-globe" },
  android: { label: "Android App", icon: "fas fa-mobile-alt" },
};

export const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/Portfolio`)
      .then((res) => {
        if (isMounted && res?.data?.data?.length) {
          setPortfolioData(res.data.data[0]);
          if (res.data.data.length > 1) {
            setPortfolioItems(res.data.data.slice(1));
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const projectsList =
    portfolioItems && portfolioItems.length > 0
      ? portfolioItems
      : defaultProjects;

  const filteredProjects =
    activeCategory === "all"
      ? projectsList
      : projectsList.filter(
          (p) => (p.category || "webapp") === activeCategory
        );

  return (
    <section
      className="py-5"
      id="portfolio"
      style={{
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background decoration */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,32,41,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-80px",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container py-lg-5 py-4" style={{ position: "relative", zIndex: 2 }}>
        {/* ── Section Header ── */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "760px" }}>
          <span className="pt-badge-live">
            <span className="pt-live-dot" />
            {portfolioData?.title || "Our Work"}
          </span>
          <h2
            className="fw-bold mb-3 display-6"
            style={{ color: "#0f172a", marginTop: "12px" }}
          >
            {portfolioData?.heading ||
              "Transforming Ideas Into Impactful Digital Products"}
          </h2>
          <p className="text-muted" style={{ fontSize: "1.05rem" }}>
            From powerful web apps and stunning websites to high-performance
            Android applications — every project is built with engineering
            precision and design excellence.
          </p>

          {/* Category Filter Tabs */}
          <div className="pt-filter-tabs mt-4">
            {Object.entries(categoryConfig).map(([key, cfg]) => (
              <button
                key={key}
                className={`pt-filter-btn ${activeCategory === key ? "active" : ""}`}
                onClick={() => setActiveCategory(key)}
              >
                <i className={cfg.icon} style={{ marginRight: "6px", fontSize: "0.85rem" }} />
                {cfg.label}
              </button>
            ))}
          </div>

          {/* Project Count Badge */}
          <div className="mt-3">
            <span
              style={{
                fontSize: "0.82rem",
                color: "#64748b",
                fontWeight: "500",
              }}
            >
              Showing{" "}
              <strong style={{ color: "var(--pt-primary)" }}>
                {filteredProjects.length}
              </strong>{" "}
              project{filteredProjects.length !== 1 ? "s" : ""}
              {activeCategory !== "all"
                ? ` in ${categoryConfig[activeCategory]?.label}`
                : " across all categories"}
            </span>
          </div>
        </div>

        {/* ── Projects Grid ── */}
        <div className="row g-4">
          {filteredProjects.map((project, idx) => {
            const isHovered = hoveredId === (project.id || idx);
            const accentColor =
              project.accentColor || "var(--pt-primary)";
            const gradient =
              project.gradient ||
              "linear-gradient(135deg, var(--pt-primary) 0%, #ff6b7d 100%)";
            const tech = project.tech || ["React", "Node.js"];
            const features = project.features || [];

            return (
              <div key={project.id || idx} className="col-lg-4 col-md-6">
                <SpotlightCard
                  className="h-100 position-relative"
                  maxTilt={6}
                  style={{ overflow: "hidden" }}
                  onMouseEnter={() => setHoveredId(project.id || idx)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Top accent bar */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: gradient,
                    }}
                  />

                  {/* Project Image / Visual */}
                  <div
                    style={{
                      position: "relative",
                      height: "200px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      margin: "12px 12px 0",
                    }}
                  >
                    {project.images ? (
                      <img
                        src={`${API.BASE_URL_IMAGES}${project.images}`}
                        alt={project.title || project.sub_heading}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.4s ease",
                          transform: isHovered ? "scale(1.06)" : "scale(1)",
                        }}
                      />
                    ) : (
                      /* Illustrative placeholder when no image is set */
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: gradient,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "12px",
                        }}
                      >
                        {/* Device frame illustration */}
                        <div
                          style={{
                            background: "rgba(255,255,255,0.15)",
                            backdropFilter: "blur(8px)",
                            borderRadius: "16px",
                            padding: "24px 32px",
                            textAlign: "center",
                            border: "1px solid rgba(255,255,255,0.25)",
                          }}
                        >
                          <i
                            className={project.icon || "fas fa-laptop-code"}
                            style={{
                              fontSize: "2.8rem",
                              color: "#fff",
                              marginBottom: "10px",
                              display: "block",
                            }}
                          />
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "rgba(255,255,255,0.85)",
                              fontWeight: "600",
                              letterSpacing: "1px",
                            }}
                          >
                            {(project.sub_heading || project.category || "PROJECT").toUpperCase()}
                          </div>
                        </div>

                        {/* Floating mini-dots */}
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            style={{
                              position: "absolute",
                              width: `${6 + (i % 3) * 4}px`,
                              height: `${6 + (i % 3) * 4}px`,
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.18)",
                              top: `${15 + i * 12}%`,
                              left: `${8 + i * 14}%`,
                              animation: `pt-float ${2.5 + i * 0.4}s ease-in-out infinite`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Status badge overlay */}
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "rgba(16,185,129,0.9)",
                        backdropFilter: "blur(4px)",
                        color: "#fff",
                        fontSize: "0.7rem",
                        fontWeight: "700",
                        padding: "3px 10px",
                        borderRadius: "99px",
                        letterSpacing: "0.5px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#fff",
                          display: "inline-block",
                        }}
                      />
                      {project.status || "Live"}
                    </div>

                    {/* Category badge overlay */}
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(4px)",
                        color: "#fff",
                        fontSize: "0.68rem",
                        fontWeight: "700",
                        padding: "3px 10px",
                        borderRadius: "99px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {categoryConfig[project.category]?.label ||
                        project.sub_heading ||
                        "Project"}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    {/* Title */}
                    <h4
                      className="fw-bold mb-2"
                      style={{ fontSize: "1.15rem", color: "#0f172a" }}
                    >
                      {project.title || project.sub_heading}
                    </h4>

                    {/* Description */}
                    <p
                      className="text-muted mb-3"
                      style={{ fontSize: "0.88rem", lineHeight: "1.7" }}
                      dangerouslySetInnerHTML={{
                        __html:
                          project.description ||
                          project.contents ||
                          project.sub_content,
                      }}
                    />

                    {/* Key Features */}
                    {features.length > 0 && (
                      <div className="mb-3">
                        {features.map((feat, fIdx) => (
                          <div
                            key={fIdx}
                            className="d-flex align-items-center gap-2 mb-1"
                          >
                            <i
                              className="fas fa-check-circle"
                              style={{
                                color: accentColor,
                                fontSize: "0.78rem",
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{ fontSize: "0.82rem", color: "#475569" }}
                            >
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack Tags */}
                    <div className="d-flex flex-wrap gap-1 mb-4">
                      {tech.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: "600",
                            padding: "3px 9px",
                            borderRadius: "6px",
                            background: "#f1f5f9",
                            color: "#475569",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Divider + CTA */}
                    <div
                      className="pt-2 d-flex align-items-center justify-content-between"
                      style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <span
                        style={{
                          fontSize: "0.78rem",
                          color: "#94a3b8",
                          fontWeight: "500",
                        }}
                      >
                        <i
                          className="fas fa-layer-group"
                          style={{ marginRight: "5px" }}
                        />
                        {tech.length} Technologies
                      </span>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          color: accentColor,
                          fontWeight: "700",
                          fontSize: "0.88rem",
                          cursor: "pointer",
                          transition: "gap 0.2s ease",
                        }}
                      >
                        View Details
                        <i
                          className="fas fa-arrow-right"
                          style={{ fontSize: "0.78rem" }}
                        />
                      </button>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            );
          })}
        </div>

        {/* ── Stats Row ── */}
        <div
          className="row g-4 mt-5"
          style={{
            borderTop: "1px solid rgba(0,0,0,0.07)",
            paddingTop: "40px",
          }}
        >
          {[
            {
              icon: "fas fa-laptop-code",
              value: "10+",
              label: "Web Applications",
              color: "var(--pt-primary)",
            },
            {
              icon: "fas fa-globe",
              value: "8+",
              label: "Websites Delivered",
              color: "var(--pt-secondary)",
            },
            {
              icon: "fas fa-mobile-alt",
              value: "5+",
              label: "Android Apps",
              color: "#10b981",
            },
            {
              icon: "fas fa-users",
              value: "50K+",
              label: "End Users Served",
              color: "#f59e0b",
            },
          ].map((stat, i) => (
            <div key={i} className="col-6 col-lg-3">
              <div className="text-center">
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: `${stat.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                    fontSize: "1.3rem",
                    color: stat.color,
                  }}
                >
                  <i className={stat.icon} />
                </div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "800",
                    color: "#0f172a",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginTop: "4px",
                    fontWeight: "500",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
