import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../Config/API";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

export const Footer = () => {
  const [templates, setTemplates] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/AboutUs`)
      .then((res) => {
        if (isMounted && res?.data?.data?.[0]) {
          setTemplates(res.data.data[0]);
        }
      })
      .catch(() => {
        // Fallback gracefully if API is offline
      });

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      isMounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const fallbackAbout =
    "ParakshTech is a forward-thinking digital engineering and IT consulting firm dedicated to building next-generation web platforms, AI systems, cloud infrastructure, and custom software that accelerate business growth.";

  const aboutHtml =
    templates?.contents && templates.contents.trim().length > 10
      ? templates.contents
      : fallbackAbout;

  return (
    <>
      <footer className="pt-footer py-5">
        <div className="container pt-4">
          <div className="row g-4 justify-content-between">
            {/* Column 1: Brand & Mission */}
            <div className="col-lg-4 col-md-6 pe-lg-4">
              <Link
                to="/"
                className="pt-brand-logo mb-3 d-inline-flex align-items-center"
                style={{ color: "#ffffff", textDecoration: "none" }}
              >
                <img
                  src={logo}
                  alt="ParakshTech Logo"
                  style={{
                    width: "48px",
                    height: "auto",
                    marginRight: "3px",
                    filter: "drop-shadow(0 2px 8px rgba(245, 32, 41, 0.4))",
                  }}
                />
                <span style={{ fontWeight: "800", letterSpacing: "-0.5px", color: "#ffffff" }}>
                  <span style={{ color: "var(--pt-primary)" }}>ARAKSH</span>TECH
                </span>
              </Link>
              <div
                className="pt-footer-about-content mb-3"
                style={{
                  fontSize: "0.94rem",
                  lineHeight: "1.75",
                  color: "#cbd5e1",
                }}
                dangerouslySetInnerHTML={{
                  __html: aboutHtml,
                }}
              ></div>

              {/* Social Media Grid */}
              <div className="d-flex align-items-center gap-2 mt-4">
                <a
                  href="https://www.linkedin.com/company/parakshtech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pt-social-icon-btn"
                  aria-label="LinkedIn"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61579256180141"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pt-social-icon-btn"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://www.instagram.com/parakshtech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pt-social-icon-btn"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="mailto:support@parakshtech.com"
                  className="pt-social-icon-btn"
                  aria-label="Email Us"
                >
                  <i className="fas fa-envelope"></i>
                </a>
              </div>
            </div>

            {/* Column 2: Core Services */}
            <div className="col-lg-2 col-md-6">
              <h6>Services</h6>
              <ul>
                <li>
                  <Link to="/services">Web Engineering</Link>
                </li>
                <li>
                  <Link to="/services">Cloud & DevOps</Link>
                </li>
                <li>
                  <Link to="/services">Mobile Apps</Link>
                </li>
                <li>
                  <Link to="/services">AI & Automation</Link>
                </li>
                <li>
                  <Link to="/services">Cybersecurity</Link>
                </li>
                <li>
                  <Link to="/services">UI/UX Innovation</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className="col-lg-2 col-md-6">
              <h6>Quick Links</h6>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/services">Our Services</Link>
                </li>
                <li>
                  <Link to="/careers">Careers</Link>
                </li>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter & Contact info */}
            <div className="col-lg-4 col-md-6">
              <h6>Stay Connected</h6>
              <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "15px" }}>
                Subscribe for the latest tech insights, product updates, and digital engineering trends.
              </p>

              <form onSubmit={handleSubscribe} className="mb-4">
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your work email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#ffffff",
                      borderRadius: "999px 0 0 999px",
                      padding: "10px 18px",
                      fontSize: "0.88rem",
                    }}
                  />
                  <button
                    type="submit"
                    className="pt-btn-primary"
                    style={{
                      borderRadius: "0 999px 999px 0",
                      padding: "10px 20px",
                      fontSize: "0.88rem",
                    }}
                  >
                    Join
                  </button>
                </div>
                {subscribed && (
                  <small className="text-success mt-2 d-block">
                    <i className="fas fa-check-circle me-1"></i> Thank you for subscribing!
                  </small>
                )}
              </form>

              <div style={{ fontSize: "0.88rem", color: "#94a3b8" }}>
                <div className="d-flex align-items-center mb-2 gap-2">
                  <i className="fas fa-map-marker-alt" style={{ color: "var(--pt-primary)" }}></i>
                  <span>Pustakalaya Road, Buxar, Bihar</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fas fa-phone-alt" style={{ color: "var(--pt-primary)" }}></i>
                  <a href="tel:+919296454675" style={{ color: "#94a3b8", textDecoration: "none" }}>
                    +91 9296454675
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright bar */}
          <div
            className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 pt-4"
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}
          >
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#64748b" }}>
              © {new Date().getFullYear()} ParakshTech. All rights reserved. Built for high performance.
            </p>
            <div className="d-flex gap-3 mt-3 mt-md-0" style={{ fontSize: "0.85rem" }}>
              <Link to="/about" style={{ color: "#64748b", textDecoration: "none" }}>
                Privacy Policy
              </Link>
              <span style={{ color: "#334155" }}>•</span>
              <Link to="/about" style={{ color: "#64748b", textDecoration: "none" }}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`pt-movetop-btn ${showScrollTop ? "visible" : ""}`}
        aria-label="Scroll to top"
        title="Go to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  );
};

export default Footer;
