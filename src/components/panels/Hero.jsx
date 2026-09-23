import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../Config/API";
import { Link } from "react-router-dom";
import TechNetworkCanvas from "../common/TechNetworkCanvas";
import SpotlightCard from "../common/SpotlightCard";

/**
 * Main Clean & Modern Interactive Home Hero with Canvas Particle Physics & 3D Tilt Graphics
 * Completely free of cluttered photographic backgrounds for maximum clarity and aesthetic impact.
 */
const Hero = () => {
  const [heroBanner, setHeroBanner] = useState(null);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/Hero`)
      .then((res) => {
        if (isMounted && res?.data?.data?.length) {
          setHeroBanner(res.data.data[0]);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="pt-hero-wrapper position-relative">
      {/* Interactive Physics Canvas Background reacting to mouse moves */}
      <TechNetworkCanvas
        particleCount={75}
        particleColor="rgba(245, 32, 41, 0.45)"
        secondaryColor="rgba(99, 102, 241, 0.35)"
        lineColor="rgba(245, 32, 41, 0.12)"
        maxDistance={150}
        interactive={true}
      />

      <div className="container pt-hero-content">
        <div className="row align-items-center g-5">
          {/* Left Column: Headlines & CTA */}
          <div className="col-lg-7 text-start">
            <div className="pt-badge-live">
              <span className="pt-live-dot"></span>
              <span>Next-Gen IT & Digital Engineering Solutions</span>
            </div>

            <h1
              className="display-4 fw-bold mb-3"
              style={{
                letterSpacing: "-0.8px",
                lineHeight: "1.18",
                color: "#0f172a",
              }}
            >
              Architecting <span className="pt-gradient-text">Intelligent</span> Digital Systems That Scale.
            </h1>

            <p
              className="lead mb-4"
              style={{
                color: "#475569",
                fontSize: "1.12rem",
                lineHeight: "1.75",
                maxWidth: "620px",
              }}
            >
              {heroBanner?.heading ||
                "We engineer enterprise software, cloud-native architectures, high-impact web applications, and AI integrations engineered for velocity, resilience, and exponential growth."}
            </p>

            <div className="d-flex flex-wrap gap-3 align-items-center mb-5">
              <Link to="/services" className="pt-btn-primary">
                <span>Explore Solutions</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
              <Link to="/contact" className="pt-btn-outline">
                <i className="fas fa-calendar-check" style={{ color: "var(--pt-primary)" }}></i>
                <span>Schedule a Call</span>
              </Link>
            </div>

            {/* Quick Metrics & Trust Badges */}
            <div
              className="d-flex flex-wrap gap-4 pt-3 align-items-center"
              style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
            >
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-check-circle" style={{ color: "var(--pt-primary)", fontSize: "1.1rem" }}></i>
                <span style={{ fontSize: "0.92rem", fontWeight: "600", color: "#1e293b" }}>500+ Projects Delivered</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-shield-alt" style={{ color: "var(--pt-secondary)", fontSize: "1.1rem" }}></i>
                <span style={{ fontSize: "0.92rem", fontWeight: "600", color: "#1e293b" }}>99.9% Uptime Guarantee</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-headset" style={{ color: "#10b981", fontSize: "1.1rem" }}></i>
                <span style={{ fontSize: "0.92rem", fontWeight: "600", color: "#1e293b" }}>24/7 Expert Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Tech Hub Graphic */}
          <div className="col-lg-5">
            <SpotlightCard className="pt-tech-card-3d" maxTilt={10}>
              {/* Floating Badge Top Right */}
              <div className="pt-tech-card-badge badge-top-right pt-animate-float">
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, var(--pt-primary) 0%, #ff4757 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-bolt"></i>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "500" }}>Performance</div>
                  <div style={{ fontSize: "0.92rem", fontWeight: "700", color: "#0f172a" }}>10x Velocity</div>
                </div>
              </div>

              {/* Floating Badge Bottom Left */}
              <div className="pt-tech-card-badge badge-bottom-left pt-animate-float-slow">
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-star"></i>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "500" }}>Client Review</div>
                  <div style={{ fontSize: "0.92rem", fontWeight: "700", color: "#0f172a" }}>4.9/5.0 Rated</div>
                </div>
              </div>

              {/* Interactive Visual Dashboard */}
              <div className="text-start">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#ef4444",
                        display: "inline-block",
                      }}
                    ></span>
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#f59e0b",
                        display: "inline-block",
                      }}
                    ></span>
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#10b981",
                        display: "inline-block",
                      }}
                    ></span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      padding: "3px 10px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                      color: "var(--pt-secondary)",
                    }}
                  >
                    LIVE ARCHITECTURE
                  </span>
                </div>

                <h4 style={{ fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
                  Cloud & Fullstack Engineering
                </h4>
                <p style={{ fontSize: "0.88rem", color: "#64748b", marginBottom: "18px" }}>
                  Modern microservices, scalable distributed APIs, and responsive web systems.
                </p>

                {/* Live Cyber Code Terminal Graphic */}
                <div
                  className="p-3 rounded-3 mb-4"
                  style={{
                    background: "#080c14",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.5)",
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                  }}
                >
                  <div
                    className="d-flex justify-content-between align-items-center mb-2 pb-2"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <span style={{ color: "#38bdf8" }}>❯ deploy --cluster parakshtech-prod</span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "2px 8px",
                        borderRadius: "99px",
                        background: "rgba(16, 185, 129, 0.2)",
                        color: "#34d399",
                        fontWeight: "600",
                      }}
                    >
                      ● LIVE (14ms)
                    </span>
                  </div>
                  <div style={{ color: "#94a3b8", lineHeight: "1.7" }}>
                    <div><span style={{ color: "#34d399" }}>✔</span> Cloud Infrastructure: AWS Multi-AZ</div>
                    <div><span style={{ color: "#34d399" }}>✔</span> Security Layer: Zero-Trust WAF Active</div>
                    <div><span style={{ color: "#f472b6" }}>⚡ Autoscaling:</span> Ready (100% SLA)</div>
                  </div>
                </div>

                {/* Animated progress / tech items */}
                <div className="d-flex flex-column gap-3 mb-4">
                  <div>
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: "0.82rem", fontWeight: "600" }}>
                      <span>System Reliability</span>
                      <span style={{ color: "var(--pt-primary)" }}>99.98%</span>
                    </div>
                    <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: "99.98%",
                          height: "100%",
                          background: "linear-gradient(90deg, var(--pt-primary), #ff6b7d)",
                          borderRadius: "99px",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: "0.82rem", fontWeight: "600" }}>
                      <span>Cloud Optimization</span>
                      <span style={{ color: "var(--pt-secondary)" }}>96.4%</span>
                    </div>
                    <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: "96.4%",
                          height: "100%",
                          background: "linear-gradient(90deg, var(--pt-secondary), #818cf8)",
                          borderRadius: "99px",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Tech Badges */}
                <div className="d-flex flex-wrap gap-2 pt-2">
                  <span className="badge bg-light text-dark border px-2 py-1">React 19</span>
                  <span className="badge bg-light text-dark border px-2 py-1">Node.js</span>
                  <span className="badge bg-light text-dark border px-2 py-1">AWS Cloud</span>
                  <span className="badge bg-light text-dark border px-2 py-1">Python / AI</span>
                  <span className="badge bg-light text-dark border px-2 py-1">Microservices</span>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Clean & Modern About Hero Banner with Canvas Graphics & Live Badges
 * (Zero photographic background clutter)
 */
const AboutHero = () => {
  const [aboutHero, setAboutHero] = useState(null);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/AboutHero`)
      .then((res) => {
        if (isMounted && res?.data?.data?.[0]) {
          setAboutHero(res.data.data[0]);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="pt-inner-hero">
      <TechNetworkCanvas
        className="pt-inner-hero-canvas"
        particleCount={45}
        particleColor="rgba(245, 32, 41, 0.45)"
        lineColor="rgba(245, 32, 41, 0.12)"
      />
      <div className="container position-relative" style={{ zIndex: 3 }}>
        <div className="pt-badge-live mb-2">
          <span className="pt-live-dot"></span>
          <span>Pioneering Digital Innovation Since 2016</span>
        </div>
        <h1 className="fw-bold mb-2 pt-gradient-text-light display-5">
          {aboutHero?.title || "About ParakshTech"}
        </h1>
        <p className="lead mb-0 text-white-50" style={{ maxWidth: "620px" }}>
          Pioneering reliable digital solutions, scalable tech architecture, and innovation-driven results across enterprises worldwide.
        </p>
        <div className="pt-breadcrumb-bar">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <span className="active-item">About Us</span>
        </div>
      </div>
    </section>
  );
};

/**
 * Clean & Modern Services Hero Banner with Canvas Graphics
 * (Zero photographic background clutter)
 */
const ServicesHero = () => {
  const [serviceHero, setServiceHero] = useState(null);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/Servicesmain`)
      .then((res) => {
        if (isMounted && res?.data?.data?.[0]) {
          setServiceHero(res.data.data[0]);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="pt-inner-hero">
      <TechNetworkCanvas
        className="pt-inner-hero-canvas"
        particleCount={45}
        particleColor="rgba(0, 242, 254, 0.45)"
        lineColor="rgba(0, 242, 254, 0.12)"
      />
      <div className="container position-relative" style={{ zIndex: 3 }}>
        <div className="pt-badge-live mb-2">
          <span className="pt-live-dot"></span>
          <span>Full-Cycle Enterprise Engineering & Cloud Architecture</span>
        </div>
        <h1 className="fw-bold mb-2 pt-gradient-text-light display-5">
          {serviceHero?.title || "Our Technology Services"}
        </h1>
        <p className="lead mb-0 text-white-50" style={{ maxWidth: "620px" }}>
          End-to-end digital engineering, cloud computing, and AI architectures designed to scale your operations and drive measurable ROI.
        </p>
        <div className="pt-breadcrumb-bar">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <span className="active-item">Services</span>
        </div>
      </div>
    </section>
  );
};

/**
 * Clean & Modern Service Details Hero
 */
const ServicesHeroDetails = ({ data }) => {
  const titleCase = (str) =>
    str
      ? str
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Service Detail";

  return (
    <section className="pt-inner-hero">
      <TechNetworkCanvas
        className="pt-inner-hero-canvas"
        particleCount={35}
        particleColor="rgba(245, 32, 41, 0.45)"
        lineColor="rgba(245, 32, 41, 0.12)"
      />
      <div className="container position-relative" style={{ zIndex: 3 }}>
        <div className="pt-badge-live mb-2">
          <span className="pt-live-dot"></span>
          <span>Specialized Enterprise Solution</span>
        </div>
        <h1 className="fw-bold mb-2 pt-gradient-text-light display-5">
          {titleCase(data?.title)}
        </h1>
        <div className="pt-breadcrumb-bar">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <Link to="/services">Services</Link>
          <span className="separator">/</span>
          <span className="active-item">{titleCase(data?.title)}</span>
        </div>
      </div>
    </section>
  );
};

/**
 * Clean & Modern Career Hero Banner
 */
const CareerHero = () => {
  const [careerHero, setCareerHero] = useState(null);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/career`)
      .then((res) => {
        if (isMounted && res?.data?.data?.[0]) {
          setCareerHero(res.data.data[0]);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="pt-inner-hero">
      <TechNetworkCanvas
        className="pt-inner-hero-canvas"
        particleCount={45}
        particleColor="rgba(16, 185, 129, 0.45)"
        lineColor="rgba(16, 185, 129, 0.12)"
      />
      <div className="container position-relative" style={{ zIndex: 3 }}>
        <div className="pt-badge-live mb-2">
          <span className="pt-live-dot" style={{ backgroundColor: "#10b981" }}></span>
          <span>We Are Actively Hiring Engineers & Architects</span>
        </div>
        <h1 className="fw-bold mb-2 pt-gradient-text-light display-5">
          {careerHero?.title || "Careers & Open Positions"}
        </h1>
        <p className="lead mb-0 text-white-50" style={{ maxWidth: "620px" }}>
          Build the future of software, cloud, and AI with an elite team of innovators, thinkers, and builders.
        </p>
        <div className="pt-breadcrumb-bar">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <span className="active-item">Careers</span>
        </div>
      </div>
    </section>
  );
};

/**
 * Clean & Modern Contact Hero Banner
 */
const ContactHero = () => {
  return (
    <section className="pt-inner-hero">
      <TechNetworkCanvas
        className="pt-inner-hero-canvas"
        particleCount={45}
        particleColor="rgba(245, 32, 41, 0.45)"
        lineColor="rgba(245, 32, 41, 0.12)"
      />
      <div className="container position-relative" style={{ zIndex: 3 }}>
        <div className="pt-badge-live mb-2">
          <span className="pt-live-dot"></span>
          <span>24-Hour Technical Discovery & Estimation SLA</span>
        </div>
        <h1 className="fw-bold mb-2 pt-gradient-text-light display-5">
          Let's Build Something Extraordinary
        </h1>
        <p className="lead mb-0 text-white-50" style={{ maxWidth: "620px" }}>
          Have a strategic project in mind or need expert technical consulting? Connect directly with our lead architects.
        </p>
        <div className="pt-breadcrumb-bar">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <span className="active-item">Contact</span>
        </div>
      </div>
    </section>
  );
};

/**
 * WeManageYourBusiness Panel
 */
const WeManageYourBusiness = () => {
  const [serviceHeroSub, setServiceHeroSub] = useState(null);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/Servicessub`)
      .then((res) => {
        if (isMounted && res?.data?.data?.[0]) {
          setServiceHeroSub(res.data.data[0]);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-5" style={{ background: "#f8fafc" }}>
      <div className="container py-lg-5 py-3">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span className="pt-badge-live">
              <span className="pt-live-dot"></span>
              Strategic Execution
            </span>
            <h2 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
              {serviceHeroSub?.title || "We Accelerate & Manage Your Digital Infrastructure"}
            </h2>
            <div
              className="mt-3 text-muted"
              style={{ lineHeight: "1.8", fontSize: "1.02rem" }}
              dangerouslySetInnerHTML={{
                __html:
                  serviceHeroSub?.contents ||
                  "<p>From modern cloud transformations to dedicated software engineering, our certified specialists ensure your digital products perform seamlessly, securely, and without downtime.</p>",
              }}
            ></div>
            <div className="mt-4">
              <Link to="/contact" className="pt-btn-primary">
                <span>Start a Project</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <SpotlightCard className="p-3 shadow-lg" maxTilt={8}>
              <img
                src={
                  serviceHeroSub?.images
                    ? `${API.BASE_URL_IMAGES}${serviceHeroSub.images}`
                    : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                }
                alt="Digital Infrastructure Solutions"
                className="img-fluid rounded-4"
                style={{ maxHeight: "420px", width: "100%", objectFit: "cover" }}
              />
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export {
  Hero,
  AboutHero,
  ServicesHero,
  WeManageYourBusiness,
  CareerHero,
  ContactHero,
  ServicesHeroDetails,
};
