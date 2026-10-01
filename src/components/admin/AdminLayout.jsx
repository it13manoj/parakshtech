import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import logo from "../../assets/images/logo.png";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0b0f19",
        color: "#f8fafc",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: sidebarOpen ? "270px" : "80px",
          background: "rgba(15, 23, 42, 0.95)",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 100,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: "24px 20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarOpen ? "space-between" : "center",
          }}
        >
          <Link
            to="/admin/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
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
              <div>
                <div style={{ fontWeight: "800", fontSize: "1.1rem", color: "#ffffff", lineHeight: 1 }}>
                  <span style={{ color: "var(--pt-primary)" }}>ARAKSH</span>TECH
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--pt-primary)",
                    fontWeight: "700",
                    letterSpacing: "1px",
                    marginTop: "3px",
                  }}
                >
                  ADMIN CONSOLE
                </div>
              </div>
            )}
          </Link>

          {sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                padding: "4px",
              }}
              aria-label="Collapse sidebar"
            >
              <i className="fas fa-angle-left" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div style={{ padding: "20px 12px", flexGrow: 1 }}>
          {!sidebarOpen && (
            <div className="text-center mb-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  color: "#cbd5e1",
                  borderRadius: "8px",
                  padding: "8px",
                  cursor: "pointer",
                }}
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
                    }}
                  />
                  {sidebarOpen && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexGrow: 1,
                      }}
                    >
                      <span>{item.label}</span>
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
            }}
            title="View Live Site"
          >
            <i className="fas fa-external-link-alt" style={{ width: "20px", textAlign: "center" }} />
            {sidebarOpen && <span>View Public Site</span>}
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
            }}
            title="Logout"
          >
            <i className="fas fa-sign-out-alt" style={{ width: "20px", textAlign: "center" }} />
            {sidebarOpen && <span style={{ fontWeight: "600" }}>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Navbar */}
        <header
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 90,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ fontSize: "1.05rem", fontWeight: "700", color: "#ffffff" }}>
              ParakshTech Content Management
            </div>
            <span
              style={{
                fontSize: "0.72rem",
                padding: "3px 10px",
                borderRadius: "99px",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#34d399",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                fontWeight: "600",
              }}
            >
              ● MySQL Database Live
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
        <main style={{ padding: "30px", flexGrow: 1, overflowX: "hidden" }}>
          <AdminErrorBoundary>
            <Outlet />
          </AdminErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

