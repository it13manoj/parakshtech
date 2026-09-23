import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../Config/API";
import { Link } from "react-router-dom";
import SpotlightCard from "../common/SpotlightCard";

export const AboutUs = () => {
  const [templates, setTemplates] = useState(null);

  const fallbackChecklist = [
    { sub_heading: "End-to-End Enterprise Architecture & Development" },
    { sub_heading: "Human-Centered UI/UX Design & Interactive Systems" },
    { sub_heading: "DevSecOps, Continuous Delivery & Zero-Downtime Releases" },
    { sub_heading: "24/7 Dedicated Infrastructure Monitoring & SLAs" },
  ];

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/AboutUs`)
      .then((res) => {
        if (isMounted && res?.data?.data?.[0]) {
          setTemplates(res.data.data[0]);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Bulletproof array extraction to eliminate checklist.map errors under any API response format
  const getSafeChecklist = () => {
    if (Array.isArray(templates?.assets) && templates.assets.length > 0) {
      return templates.assets;
    }
    if (typeof templates?.assets === "string") {
      try {
        const parsed = JSON.parse(templates.assets);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}

      if (templates.assets.includes(",") || templates.assets.includes("\n")) {
        return templates.assets
          .split(/[\n,]+/)
          .map((item) => ({ sub_heading: item.replace(/<[^>]*>?/gm, "").trim() }))
          .filter((item) => item.sub_heading);
      }
    }
    return fallbackChecklist;
  };

  const checklist = getSafeChecklist();

  return (
    <section className="py-5" style={{ background: "#ffffff", position: "relative" }}>
      <div className="container py-lg-5 py-4">
        <div className="row align-items-center g-5">
          {/* Left Narrative */}
          <div className="col-lg-6">
            <span className="pt-badge-live">
              <span className="pt-live-dot"></span>
              {templates?.title || "Who We Are"}
            </span>

            <h2 className="fw-bold mb-3 display-6" style={{ color: "#0f172a" }}>
              {templates?.heading || "Driving Digital Transformation Through World-Class Engineering"}
            </h2>

            <div
              className="text-muted mb-4"
              style={{ fontSize: "1.05rem", lineHeight: "1.75" }}
              dangerouslySetInnerHTML={{
                __html:
                  templates?.contents ||
                  "<p>At ParakshTech, we believe great software is born at the intersection of architectural discipline and creative problem solving. We partner with ambitious startups and Fortune enterprises to craft custom digital products that perform reliably under pressure.</p>",
              }}
            ></div>

            {/* Checklist items with Safe Mapping */}
            <div className="d-flex flex-column gap-3 mb-4">
              {Array.isArray(checklist) &&
                checklist.map((row, idx) => {
                  const label =
                    typeof row === "string"
                      ? row
                      : row?.sub_heading || row?.title || "";
                  if (!label) return null;

                  return (
                    <div key={idx} className="d-flex align-items-center gap-3">
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(245, 32, 41, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--pt-primary)",
                          fontSize: "0.85rem",
                          flexShrink: 0,
                        }}
                      >
                        <i className="fas fa-check"></i>
                      </div>
                      <span
                        style={{
                          fontWeight: "600",
                          color: "#1e293b",
                          fontSize: "0.98rem",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
            </div>

            <div className="pt-3">
              <Link to="/services" className="pt-btn-primary">
                <span>Explore Our Solutions</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Right Image Showcase with 3D Spotlight */}
          <div className="col-lg-6">
            <SpotlightCard className="p-3 shadow-lg position-relative" maxTilt={8}>
              <img
                src={
                  templates?.images
                    ? `${API.BASE_URL_IMAGES}${templates.images}`
                    : "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80"
                }
                alt="ParakshTech Engineering Team"
                className="img-fluid rounded-4"
                style={{ width: "100%", maxHeight: "480px", objectFit: "cover" }}
              />

              {/* Quality Seal Badge */}
              <div
                className="pt-animate-float"
                style={{
                  position: "absolute",
                  bottom: "25px",
                  left: "25px",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(12px)",
                  padding: "12px 20px",
                  borderRadius: "14px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(245, 32, 41, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--pt-primary)",
                    fontSize: "1.2rem",
                  }}
                >
                  <i className="fas fa-certificate"></i>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600" }}>
                    CERTIFIED
                  </div>
                  <div style={{ fontSize: "0.92rem", fontWeight: "700", color: "#0f172a" }}>
                    Enterprise Quality
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;