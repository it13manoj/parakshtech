import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../Config/API";
import { Link } from "react-router-dom";
import SpotlightCard from "../common/SpotlightCard";

export const ValuedServices = () => {
  const [getweb, setweb] = useState(null);
  const [template, setTemplate] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  // Fallback services if API is delayed or empty
  const defaultServices = [
    {
      id: 1,
      category: "web",
      sub_heading: "Web Engineering & Platforms",
      icon: "fas fa-code",
      contents:
        "High-performance, accessible, and scalable web applications built with modern frameworks, decoupled APIs, and cloud-optimized architectures.",
      tags: ["React", "Node.js", "GraphQL", "Next.js"],
    },
    {
      id: 2,
      category: "cloud",
      sub_heading: "Cloud Infrastructure & DevOps",
      icon: "fas fa-cloud",
      contents:
        "Automated deployment pipelines, scalable Kubernetes clustering, serverless architectures, and 24/7 cloud monitoring on AWS, Azure, and GCP.",
      tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    },
    {
      id: 3,
      category: "mobile",
      sub_heading: "Mobile App Development",
      icon: "fas fa-mobile-alt",
      contents:
        "Cross-platform and native iOS & Android applications engineered for fluid 120fps performance, intuitive gestures, and offline-first data sync.",
      tags: ["React Native", "Flutter", "iOS", "Android"],
    },
    {
      id: 4,
      category: "ai",
      sub_heading: "AI & Intelligent Automation",
      icon: "fas fa-brain",
      contents:
        "Custom machine learning models, natural language processing, intelligent RPA bots, and generative AI integrations tailored to business workflows.",
      tags: ["Python", "TensorFlow", "OpenAI", "LangChain"],
    },
    {
      id: 5,
      category: "security",
      sub_heading: "Cybersecurity & Compliance",
      icon: "fas fa-shield-alt",
      contents:
        "Enterprise vulnerability assessment, end-to-end encryption protocols, penetration testing, and regulatory compliance (GDPR, HIPAA, SOC 2).",
      tags: ["Zero Trust", "PenTest", "SSL/TLS", "Compliance"],
    },
    {
      id: 6,
      category: "web",
      sub_heading: "UI/UX & Product Design",
      icon: "fas fa-paint-brush",
      contents:
        "Human-centered design systems, interactive prototypes, user journey mapping, and conversion-optimized digital interfaces.",
      tags: ["Figma", "Design Systems", "Prototyping", "A/B Testing"],
    },
  ];

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/ValuedServices`)
      .then((response) => {
        if (isMounted && response?.data?.data?.length) {
          setweb(response.data.data[0]);
          if (response.data.data.length > 1) {
            setTemplate(response.data.data.slice(1));
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const removewhiteSpace = (rows) => {
    return rows ? rows.replace(/\s+/g, "-").toLowerCase() : "service";
  };

  const servicesList = template && template.length > 0 ? template : defaultServices;

  const filteredServices =
    activeCategory === "all"
      ? servicesList
      : servicesList.filter((item) => (item.category || "web") === activeCategory);

  return (
    <section className="py-5" id="services" style={{ background: "#ffffff", position: "relative" }}>
      <div className="container py-lg-5 py-4">
        {/* Section Header */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "720px" }}>
          <span className="pt-badge-live">
            <span className="pt-live-dot"></span>
            {getweb?.title || "Core Capabilities"}
          </span>
          <h2 className="fw-bold mb-3 display-6" style={{ color: "#0f172a" }}>
            {getweb?.heading || "Engineering Tailored Solutions For Complex Digital Challenges"}
          </h2>
          <p className="text-muted" style={{ fontSize: "1.05rem" }}>
            We combine strategic thinking, engineering rigor, and creative design to deliver market-leading IT solutions.
          </p>

          {/* Interactive Category Filter Tabs */}
          <div className="pt-filter-tabs mt-4">
            <button
              className={`pt-filter-btn ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              All Solutions
            </button>
            <button
              className={`pt-filter-btn ${activeCategory === "web" ? "active" : ""}`}
              onClick={() => setActiveCategory("web")}
            >
              Web & Design
            </button>
            <button
              className={`pt-filter-btn ${activeCategory === "cloud" ? "active" : ""}`}
              onClick={() => setActiveCategory("cloud")}
            >
              Cloud & DevOps
            </button>
            <button
              className={`pt-filter-btn ${activeCategory === "mobile" ? "active" : ""}`}
              onClick={() => setActiveCategory("mobile")}
            >
              Mobile
            </button>
            <button
              className={`pt-filter-btn ${activeCategory === "ai" ? "active" : ""}`}
              onClick={() => setActiveCategory("ai")}
            >
              AI & Automation
            </button>
            <button
              className={`pt-filter-btn ${activeCategory === "security" ? "active" : ""}`}
              onClick={() => setActiveCategory("security")}
            >
              Security
            </button>
          </div>
        </div>

        {/* 3D Tilt & Spotlight Service Grid */}
        <div className="row g-4 justify-content-center">
          {filteredServices.map((row, idx) => {
            const slug = removewhiteSpace(row?.sub_heading || row?.title);
            const iconClass = row.icon || "fas fa-laptop-code";
            const tags = row.tags || ["Enterprise", "Cloud", "Scalable"];

            return (
              <div key={idx} className="col-lg-4 col-md-6">
                <SpotlightCard className="p-4 h-100 position-relative" maxTilt={8}>
                  {/* Top Glowing Shimmer Accent */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: "linear-gradient(90deg, var(--pt-primary), var(--pt-accent-cyan))",
                      opacity: 0.7,
                    }}
                  />

                  {/* Icon & Category Tag */}
                  <div className="d-flex align-items-center justify-content-between mb-3 pt-1">
                    <div className="pt-service-icon-box mb-0">
                      {row.images ? (
                        <img
                          src={`${API.BASE_URL_IMAGES}${row.images}`}
                          alt={row?.sub_heading || "Service"}
                          style={{ width: "36px", height: "36px", objectFit: "contain" }}
                        />
                      ) : (
                        <i className={iconClass}></i>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: "700",
                        padding: "4px 10px",
                        borderRadius: "99px",
                        background: "rgba(245, 32, 41, 0.08)",
                        color: "var(--pt-primary)",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {row.category ? row.category.toUpperCase() : "SOLUTIONS"}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="fw-bold mb-2" style={{ fontSize: "1.25rem", color: "#0f172a" }}>
                    <Link
                      to={`/services/${slug}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {row?.sub_heading || row?.title}
                    </Link>
                  </h4>

                  {/* Description */}
                  <p
                    className="text-muted flex-grow-1"
                    style={{ fontSize: "0.92rem", lineHeight: "1.65", marginBottom: "1.2rem" }}
                    dangerouslySetInnerHTML={{ __html: row?.contents || row?.sub_content }}
                  ></p>

                  {/* Tech Tags */}
                  <div className="d-flex flex-wrap gap-1 mb-4">
                    {tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          padding: "3px 9px",
                          borderRadius: "6px",
                          background: "#f1f5f9",
                          color: "#475569",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Link / CTA with micro-interaction */}
                  <div className="pt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <Link
                      to={`/services/${slug}`}
                      className="d-inline-flex align-items-center gap-2 fw-semibold"
                      style={{
                        color: "var(--pt-primary)",
                        textDecoration: "none",
                        fontSize: "0.92rem",
                        transition: "gap 0.2s ease",
                      }}
                    >
                      <span>Explore Solution</span>
                      <i className="fas fa-arrow-right" style={{ fontSize: "0.8rem" }}></i>
                    </Link>
                  </div>
                </SpotlightCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValuedServices;