import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../Config/API";
import SpotlightCard from "../common/SpotlightCard";

export const WhyChooseUs = () => {
  const [whychooseusdata, setWhyChooseusData] = useState(null);
  const [whychooseusdatafet, setWhyChooseusDatafet] = useState(null);

  const fallbackFeatures = [
    {
      sub_heading: "Agile Development Velocity",
      sub_content: "Two-week sprint cycles with live staging previews and rapid iterative feedback loops.",
      icon: "fas fa-tachometer-alt",
      color: "var(--pt-primary)",
    },
    {
      sub_heading: "Zero-Trust Security & QA",
      sub_content: "Automated vulnerability scanning, compliance audits, and 100% test coverage benchmarks.",
      icon: "fas fa-shield-virus",
      color: "var(--pt-secondary)",
    },
    {
      sub_heading: "Cloud-Native Scalability",
      sub_content: "Engineered for high concurrency, auto-scaling Kubernetes clusters, and microservice resilience.",
      icon: "fas fa-layer-group",
      color: "#10b981",
    },
    {
      sub_heading: "Transparent Engineering SLA",
      sub_content: "24/7 dedicated support, direct Slack collaboration channels, and proactive performance monitoring.",
      icon: "fas fa-handshake",
      color: "#f59e0b",
    },
  ];

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/Whychooseus`)
      .then((response) => {
        if (isMounted && response?.data?.data?.length) {
          setWhyChooseusData(response.data.data[0]);
          if (response.data.data.length > 1) {
            setWhyChooseusDatafet(response.data.data.slice(1));
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const featuresList = whychooseusdatafet && whychooseusdatafet.length > 0 ? whychooseusdatafet : fallbackFeatures;

  return (
    <section className="py-5" id="whychoose" style={{ background: "#f8fafc", position: "relative" }}>
      <div className="container py-lg-5 py-4">
        <div className="row align-items-center g-5">
          {/* Left Column: Narrative & Feature Grids */}
          <div className="col-lg-6">
            <span className="pt-badge-live">
              <span className="pt-live-dot"></span>
              {whychooseusdata?.title || "Why Partner With Us"}
            </span>

            <h2 className="fw-bold mb-3 display-6" style={{ color: "#0f172a" }}>
              {whychooseusdata?.heading || "We Engineer Solutions Built For Real-World Reliability & Scale"}
            </h2>

            <div
              className="text-muted mb-4"
              style={{ fontSize: "1.05rem", lineHeight: "1.75" }}
              dangerouslySetInnerHTML={{
                __html:
                  whychooseusdata?.contents ||
                  "With a decade of software engineering expertise, we help forward-thinking organizations overcome complex technical bottlenecks, automate workflows, and deploy enterprise digital products that win markets.",
              }}
            ></div>

            {/* Feature Cards Grid with Interactive Hover */}
            <div className="row g-3 pt-2">
              {featuresList.map((rows, idx) => (
                <div key={idx} className="col-sm-6">
                  <div
                    className="p-3 bg-white rounded-3 h-100"
                    style={{
                      border: "1px solid rgba(0,0,0,0.06)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                      transition: "all 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor = "rgba(245, 32, 41, 0.3)";
                      e.currentTarget.style.boxShadow = "0 12px 24px rgba(245, 32, 41, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.03)";
                    }}
                  >
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "10px",
                          background: "rgba(245, 32, 41, 0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: rows.color || "var(--pt-primary)",
                          fontSize: "1.1rem",
                        }}
                      >
                        {rows.images ? (
                          <img
                            src={`${API.BASE_URL_IMAGES}${rows.images}`}
                            alt={rows.sub_heading}
                            style={{ width: "22px", height: "22px", objectFit: "contain" }}
                          />
                        ) : (
                          <i className={rows.icon || "fas fa-check"}></i>
                        )}
                      </div>
                      <h5 className="fw-bold mb-0" style={{ fontSize: "1rem", color: "#0f172a" }}>
                        {rows?.sub_heading}
                      </h5>
                    </div>
                    <p
                      className="text-muted mb-0"
                      style={{ fontSize: "0.85rem", lineHeight: "1.55" }}
                      dangerouslySetInnerHTML={{ __html: rows?.sub_content }}
                    ></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Infographic Showcase & Experience Badge */}
          <div className="col-lg-6">
            <SpotlightCard className="p-3 position-relative" maxTilt={8}>
              <img
                src={
                  whychooseusdata?.images
                    ? `${API.BASE_URL_IMAGES}${whychooseusdata.images}`
                    : "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80"
                }
                alt="Technology Excellence at ParakshTech"
                className="img-fluid rounded-4"
                style={{ width: "100%", maxHeight: "480px", objectFit: "cover" }}
              />

              {/* Floating Experience Badge with Glow */}
              <div
                className="pt-animate-float"
                style={{
                  position: "absolute",
                  bottom: "30px",
                  right: "30px",
                  background: "rgba(15, 23, 42, 0.92)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#ffffff",
                  padding: "18px 24px",
                  borderRadius: "18px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.35), 0 0 25px rgba(245, 32, 41, 0.3)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2.4rem",
                    fontWeight: "800",
                    lineHeight: "1",
                    background: "linear-gradient(135deg, #ffffff 40%, var(--pt-primary) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {whychooseusdata?.assets || "10"}+
                </div>
                <div style={{ fontSize: "0.82rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Years of Excellence
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;