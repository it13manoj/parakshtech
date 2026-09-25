import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";

export const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu upon navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      id="site-header"
      className={`fixed-top pt-header-glass ${isScrolled ? "nav-fixed" : ""}`}
    >
      <div className="container">
        <nav className="navbar navbar-expand-lg">
          {/* Brand Logo: Logo Image functions as stylized 'P', followed by ARAKSHTECH */}
          <Link className="navbar-brand pt-brand-logo" to="/">
            <img
              src={logo}
              alt="ParakshTech Logo"
              style={{
                width: "44px",
                height: "44px",
                objectFit: "contain",
                marginRight: "4px",
                filter: "drop-shadow(0 2px 8px rgba(245, 32, 41, 0.25))",
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
  );
};

export default Header;
