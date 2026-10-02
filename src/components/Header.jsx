import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";

export const Header = () => {
  const location = useLocation();
  const headerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrolled = false;
    const handleScroll = () => {
      const scrolled = window.scrollY >= 20;
      if (scrolled !== lastScrolled) {
        lastScrolled = scrolled;
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and ensure body scroll is never locked
  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = "";
    document.body.classList.remove("noscroll");
  }, [location.pathname]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu when clicking or tapping outside the header
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" && !location.hash
        ? "pt-nav-link active"
        : "pt-nav-link";
    }
    return location.pathname.startsWith(path)
      ? "pt-nav-link active"
      : "pt-nav-link";
  };

  const handlePortfolioClick = (e) => {
    setIsMenuOpen(false);
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById("portfolio");
      if (el) {
        if (window.lenis) {
          window.lenis.scrollTo(el, { offset: -70 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`pt-mobile-backdrop ${isMenuOpen ? "active" : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <header
        id="site-header"
        ref={headerRef}
        className={`fixed-top pt-header-glass ${isScrolled ? "nav-fixed" : ""}`}
      >
        <div className="container">
          <nav className="navbar navbar-expand-lg">
            {/* Brand Logo: Stylized 'P' Logo + ARAKSHTECH seamlessly without gaps */}
            <Link
              className="navbar-brand pt-brand-logo"
              to="/"
              onClick={() => setIsMenuOpen(false)}
            >
              <img
                src={logo}
                alt="ParakshTech Logo"
                style={{
                  width: "auto",
                  height: "40px",
                  objectFit: "contain",
                  marginRight: "-2px",
                  filter: "drop-shadow(0 2px 6px rgba(245, 32, 41, 0.2))",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontWeight: "800", letterSpacing: "-0.5px", whiteSpace: "nowrap" }}>
                <span style={{ color: "var(--pt-primary)" }}>ARAKSH</span>TECH
              </span>
            </Link>

          {/* Mobile Toggler */}
          <button
            className={`navbar-toggler ${isMenuOpen ? "" : "collapsed"}`}
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-controls="navbarScroll"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`} style={{ color: "var(--pt-primary)", fontSize: "1.1rem" }}></i>
          </button>

          {/* Navigation Links */}
          <div
            className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
            id="navbarScroll"
          >
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item">
                <Link className={isActive("/")} to="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isActive("/about")} to="/about" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isActive("/services")} to="/services" onClick={() => setIsMenuOpen(false)}>
                  Services
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="pt-nav-link"
                  to="/#portfolio"
                  onClick={handlePortfolioClick}
                >
                  Portfolio
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isActive("/careers")} to="/careers" onClick={() => setIsMenuOpen(false)}>
                  Careers
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isActive("/contact")} to="/contact" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact"
                  className="pt-btn-primary pt-header-cta-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Get in Touch</span>
                  <i className="fas fa-arrow-right" style={{ fontSize: "0.75rem" }}></i>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
    </>
  );
};

export default Header;
