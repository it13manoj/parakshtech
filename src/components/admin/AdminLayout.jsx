import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "../../assets/css/admin-responsive.css";

// Resilient Error Boundary to safeguard Admin Sidebar from any child panel crashes
class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Admin view error caught by boundary:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            background: "rgba(30, 41, 59, 0.7)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "16px",
            padding: "40px 24px",
            textAlign: "center",
            maxWidth: "600px",
            margin: "40px auto",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              margin: "0 auto 16px",
            }}
          >
            <i className="fas fa-exclamation-triangle" />
          </div>
          <h3 style={{ color: "#ffffff", fontWeight: "700", marginBottom: "8px" }}>
            Section Temporarily Unavailable
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "0.88rem", marginBottom: "20px" }}>
            {this.state.error?.message || "An unexpected error occurred while rendering this management section."}
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                background: "var(--pt-primary)",
                color: "#ffffff",
                border: "none",
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <i className="fas fa-redo me-2" /> Reload Section
            </button>
            <a
              href="/admin/dashboard"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                color: "#cbd5e1",
                textDecoration: "none",
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Dashboard
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Persistent manual sidebar state: ONLY toggled by explicit manual user clicks
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem("pt_admin_sidebar_open");
      if (saved !== null) {
        return saved === "true";
      }
    } catch {
      // fallback
    }
    return true;
  });

  // Mobile off-canvas drawer state (< 992px)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Automatically close mobile drawer when navigating to a new route
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  // Manual event handler to toggle sidebar state across all screen devices
  const handleToggleSidebar = () => {
    if (window.innerWidth < 992) {
      setMobileDrawerOpen((prev) => !prev);
    } else {
      setSidebarOpen((prev) => {
        const next = !prev;
        try {
          localStorage.setItem("pt_admin_sidebar_open", String(next));
        } catch {
          // ignore
        }
        return next;
      });
    }
  };

  let user = { name: "Administrator" };
  try {
    const rawUser = localStorage.getItem("pt_admin_user");
    if (rawUser && rawUser !== "undefined" && rawUser !== "null") {
      user = JSON.parse(rawUser);
    }
  } catch {
    user = { name: "Administrator" };
  }

  const handleLogout = () => {
    localStorage.removeItem("pt_admin_token");
    localStorage.removeItem("pt_admin_user");
    navigate("/admin/login");
  };

  const navLinks = [
    {
      to: "/admin/dashboard",
      icon: "fas fa-tachometer-alt",
      label: "Dashboard",
    },
    {
      to: "/admin/portfolio",
      icon: "fas fa-images",
      label: "Portfolio & Gallery",
      badge: "Multi-Image",
    },
    {
      to: "/admin/services",
      icon: "fas fa-cogs",
      label: "Services Manager",
    },
    {
      to: "/admin/jobs",
      icon: "fas fa-briefcase",
      label: "Careers & Jobs",
    },
    {
      to: "/admin/team",
      icon: "fas fa-user-friends",
      label: "Team Members",
    },
    {
      to: "/admin/contacts",
      icon: "fas fa-inbox",
      label: "Client Inquiries",
    },
    {
      to: "/admin/content",
      icon: "fas fa-sliders-h",
      label: "Site Content & Hero",
    },
    {
      to: "/admin/settings",
      icon: "fas fa-shield-alt",
      label: "Account & Password",
    },
  ];

  return (
    <div className="pt-admin-wrapper">
      {/* ── Mobile Backdrop (< 992px) ── */}
      <div
        className={`pt-admin-backdrop ${mobileDrawerOpen ? "active" : ""}`}
        onClick={() => setMobileDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar ── */}
      <aside
        className={`pt-admin-sidebar ${sidebarOpen ? "open" : "collapsed"} ${
          mobileDrawerOpen ? "mobile-open" : ""
        }`}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: "24px 20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarOpen ? "space-between" : "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <Link
            to="/admin/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "36px",
                height: "36px",
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
            {sidebarOpen && (
              <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                <div style={{ fontWeight: "800", fontSize: "1.1rem", color: "#ffffff", lineHeight: 1, whiteSpace: "nowrap" }}>
                  <span style={{ color: "var(--pt-primary)" }}>ARAKSH</span>TECH
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--pt-primary)",
                    fontWeight: "700",
                    letterSpacing: "1px",
                    marginTop: "3px",
                    whiteSpace: "nowrap",
                  }}
                >
                  ADMIN CONSOLE
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Button (>= 992px) */}
          <button
            type="button"
            className="d-none d-lg-flex"
            onClick={handleToggleSidebar}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#94a3b8",
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-label="Collapse sidebar"
          >
            <i className="fas fa-angle-left" />
          </button>

          {/* Mobile Drawer Close Button (< 992px) */}
          <button
            type="button"
            className="d-flex d-lg-none"
            onClick={() => setMobileDrawerOpen(false)}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#cbd5e1",
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.82rem",
            }}
            title="Close menu"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation Items */}
        <div style={{ padding: "20px 12px", flexGrow: 1 }}>
          {!sidebarOpen && (
            <div className="d-none d-lg-block text-center mb-3">
              <button
                type="button"
                onClick={handleToggleSidebar}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#cbd5e1",
                  borderRadius: "8px",
                  width: "36px",
                  height: "36px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                title="Expand sidebar (Manual toggle)"
                aria-label="Expand sidebar"
              >
                <i className="fas fa-angle-right" />
              </button>
            </div>
          )}

          <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {navLinks.map((item) => {
              const isActive = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (window.innerWidth < 992) {
                      setMobileDrawerOpen(false);
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: sidebarOpen ? "11px 16px" : "12px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    color: isActive ? "#ffffff" : "#94a3b8",
                    background: isActive ? "var(--pt-primary)" : "transparent",
                    fontWeight: isActive ? "700" : "500",
                    fontSize: "0.88rem",
                    transition: "all 0.2s ease",
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                    boxShadow: isActive ? "0 4px 15px rgba(245, 32, 41, 0.4)" : "none",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <i
                    className={item.icon}
                    style={{
                      fontSize: "1rem",
                      width: "20px",
                      textAlign: "center",
                      color: isActive ? "#ffffff" : "var(--pt-primary)",
                      flexShrink: 0,
                    }}
                  />
                  {sidebarOpen && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexGrow: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: "0.65rem",
                            background: isActive
                              ? "rgba(255,255,255,0.25)"
                              : "rgba(245, 32, 41, 0.15)",
                            color: isActive ? "#ffffff" : "var(--pt-primary)",
                            padding: "2px 6px",
                            borderRadius: "99px",
                            fontWeight: "700",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                            marginLeft: "8px",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              borderRadius: "10px",
              color: "#94a3b8",
              textDecoration: "none",
              fontSize: "0.82rem",
              background: "rgba(255, 255, 255, 0.04)",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              flexShrink: 0,
            }}
            title="View Live Site"
          >
            <i className="fas fa-external-link-alt" style={{ width: "20px", textAlign: "center", flexShrink: 0 }} />
            {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>View Public Site</span>}
          </a>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              borderRadius: "10px",
              color: "#f87171",
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              fontSize: "0.82rem",
              cursor: "pointer",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              width: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              flexShrink: 0,
            }}
            title="Logout"
          >
            <i className="fas fa-sign-out-alt" style={{ width: "20px", textAlign: "center", flexShrink: 0 }} />
            {sidebarOpen && <span style={{ fontWeight: "600", whiteSpace: "nowrap" }}>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="pt-admin-main-area">
        {/* Top Navbar */}
        <header className="pt-admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
            {/* Manual Toggle Button */}
            <button
              type="button"
              onClick={handleToggleSidebar}
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#cbd5e1",
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
              title="Toggle Navigation Sidebar"
              aria-label="Toggle Navigation Sidebar"
            >
              <i className="fas fa-bars" style={{ fontSize: "1rem" }} />
            </button>

            <div
              className="pt-admin-topbar-title"
              style={{
                fontSize: "1.05rem",
                fontWeight: "700",
                color: "#ffffff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              ParakshTech Content Management
            </div>
            <span
              className="pt-admin-db-status"
              style={{
                fontSize: "0.72rem",
                padding: "3px 10px",
                borderRadius: "99px",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#34d399",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                fontWeight: "600",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              ● MySQL Live
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
            <Link
              to="/admin/settings"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "background 0.2s",
              }}
              title="Account & Password Settings"
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--pt-primary) 0%, #6366f1 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  color: "#ffffff",
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="d-none d-sm-block text-start">
                <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#ffffff", lineHeight: 1.2 }}>
                  {user.name || "Administrator"}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Settings & Security</div>
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Nested View */}
        <main className="pt-admin-content-view">
          <AdminErrorBoundary>
            <Outlet />
          </AdminErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

