import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";

export const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu upon navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) =>
    location.pathname === path ? "pt-nav-link active" : "pt-nav-link";

  return (
    <header
      id="site-header"
      className={`fixed-top pt-header-glass ${isScrolled ? "nav-fixed" : ""}`}
    >
      <div className="container">
        <nav className="navbar navbar-expand-lg py-2">
          {/* Brand Logo: Logo Image functions as the 'P', followed by ARAKSHTECH */}
          <Link className="navbar-brand pt-brand-logo" to="/">
            <img
              src={logo}
              alt="ParakshTech Logo"
              style={{
                width: "50px",
                height: "auto",
                marginRight: "3px",
                filter: "drop-shadow(0 2px 8px rgba(245, 32, 41, 0.25))",
              }}
            />
            <span style={{ fontWeight: "800", letterSpacing: "-0.5px" }}>
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
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "10px",
              padding: "6px 12px",
            }}
          >
            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`} style={{ color: "var(--pt-primary)" }}></i>
          </button>

          {/* Navigation Links */}
          <div
            className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
            id="navbarScroll"
          >
            <ul className="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll align-items-lg-center">
              <li className="nav-item mx-1">
                <Link className={isActive("/")} to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link className={isActive("/about")} to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link className={isActive("/services")} to="/services">
                  Services
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link className={isActive("/careers")} to="/careers">
                  Careers
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link className={isActive("/contact")} to="/contact">
                  Contact
                </Link>
              </li>
              <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                <Link to="/contact" className="pt-btn-primary" style={{ padding: "9px 22px", fontSize: "0.88rem" }}>
                  <span>Get in Touch1</span>
                  <i className="fas fa-arrow-right" style={{ fontSize: "0.8rem" }}></i>
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
