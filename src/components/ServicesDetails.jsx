import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ServicesHeroDetails } from "./panels/Hero";
import axios from "axios";
import API from "../Config/API";
import SpotlightCard from "./common/SpotlightCard";

export const ServicesDetails = () => {
  const { data } = useParams();
  const [template, setTemplate] = useState(null);

  const serviceSlug = data ? data.replace(/-/g, " ") : "Service";
  const data1 = {
    title: serviceSlug,
  };

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/${serviceSlug}`)
      .then((response) => {
        if (isMounted && response?.data?.data?.[0]) {
          setTemplate(response.data.data[0]);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [serviceSlug]);

  const defaultDetails = {
    heading: `Enterprise ${serviceSlug.toUpperCase()} Solutions`,
    contents: `<p>Our ${serviceSlug} practice combines forward-looking architecture, secure engineering standards, and high-velocity delivery. We build solutions designed to seamlessly integrate into your existing tech ecosystem while driving substantial operational efficiency.</p>`,
    assets: `<p>Key Capabilities: Full-cycle design and implementation, automated test suites, elastic horizontal scaling, strict adherence to cybersecurity best practices, and proactive 24/7 telemetry monitoring.</p>`,
    sub_content: `<p>Whether you are migrating legacy systems, refactoring microservices, or building greenfield digital platforms from scratch, our dedicated engineering team delivers with uncompromised quality.</p>`,
  };

  const currentData = template || defaultDetails;

  return (
    <>
      <ServicesHeroDetails data={data1} />
      <section className="py-5" id="service-detail" style={{ background: "#ffffff" }}>
        <div className="container py-lg-5 py-3">
          <div className="row g-5">
            {/* Main Content Body */}
            <div className="col-lg-8">
              <span className="pt-badge-live">
                <span className="pt-live-dot"></span>
                Specialized Service
              </span>

              <h2 className="fw-bold mb-4 display-6" style={{ color: "#0f172a" }}>
                {currentData.heading}
              </h2>

              <div
                className="text-muted mb-4 lead"
                style={{ lineHeight: "1.8", fontSize: "1.08rem" }}
                dangerouslySetInnerHTML={{ __html: currentData.contents }}
              ></div>

              {currentData.images && (
                <div className="mb-4">
                  <SpotlightCard className="p-2 shadow" maxTilt={5}>
                    <img
                      src={`${API.BASE_URL_IMAGES}${currentData.images}`}
                      alt={currentData.heading}
                      className="img-fluid rounded-3"
                      style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                    />
                  </SpotlightCard>
                </div>
              )}

              <div className="p-4 rounded-4 mb-4" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <h4 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                  Architecture & Deliverables
                </h4>
                <div
                  className="text-muted"
                  style={{ lineHeight: "1.8" }}
                  dangerouslySetInnerHTML={{ __html: currentData.assets }}
                ></div>
              </div>

              <div
                className="text-muted mb-5"
                style={{ lineHeight: "1.8" }}
                dangerouslySetInnerHTML={{ __html: currentData.sub_content }}
              ></div>

              <div className="p-4 rounded-4" style={{ background: "linear-gradient(135deg, #0a0e1a 0%, #1e1b4b 100%)", color: "#fff" }}>
                <div className="row align-items-center g-3">
                  <div className="col-md-8">
                    <h4 className="fw-bold mb-1 text-white">Ready to implement this solution?</h4>
                    <p className="mb-0 text-white-50" style={{ fontSize: "0.92rem" }}>
                      Our solution architects can provide a customized feasibility review within 24 hours.
                    </p>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <Link to="/contact" className="pt-btn-primary">
                      <span>Request Quote</span>
                      <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar with Navigation & Direct CTA */}
            <div className="col-lg-4">
              <div className="sticky-top" style={{ top: "100px" }}>
                {/* Related Services Navigation Card */}
                <SpotlightCard className="p-4 mb-4" maxTilt={6}>
                  <h5 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                    Explore Other Solutions
                  </h5>
                  <div className="d-flex flex-column gap-2">
                    {[
                      { name: "Web Engineering", slug: "web-engineering" },
                      { name: "Cloud & DevOps", slug: "cloud-infrastructure-devops" },
                      { name: "Mobile App Development", slug: "mobile-app-development" },
                      { name: "AI & Automation", slug: "ai-intelligent-automation" },
                      { name: "Cybersecurity & Compliance", slug: "cybersecurity-compliance" },
                      { name: "UI/UX & Product Design", slug: "ui-ux-product-design" },
                    ].map((item, idx) => (
                      <Link
                        key={idx}
                        to={`/services/${item.slug}`}
                        className="p-2 px-3 rounded-3 d-flex align-items-center justify-content-between"
                        style={{
                          textDecoration: "none",
                          color: data === item.slug ? "var(--pt-primary)" : "#334155",
                          background: data === item.slug ? "rgba(245, 32, 41, 0.08)" : "#f8fafc",
                          fontWeight: data === item.slug ? "600" : "500",
                          fontSize: "0.92rem",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <span>{item.name}</span>
                        <i className="fas fa-chevron-right" style={{ fontSize: "0.75rem" }}></i>
                      </Link>
                    ))}
                  </div>
                </SpotlightCard>

                {/* Direct Expert Contact Card */}
                <div
                  className="p-4 rounded-4 text-center"
                  style={{
                    background: "rgba(245, 32, 41, 0.04)",
                    border: "1.5px dashed rgba(245, 32, 41, 0.3)",
                  }}
                >
                  <div
                    className="mx-auto mb-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: "rgba(245, 32, 41, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--pt-primary)",
                      fontSize: "1.3rem",
                    }}
                  >
                    <i className="fas fa-phone-volume"></i>
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                    Need Immediate Consultation?
                  </h6>
                  <p className="text-muted mb-3" style={{ fontSize: "0.85rem" }}>
                    Speak directly with a lead technical consultant today.
                  </p>
                  <a
                    href="tel:+919296454675"
                    className="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 fw-semibold"
                  >
                    <i className="fas fa-phone-alt me-1"></i> +91 9296454675
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesDetails;