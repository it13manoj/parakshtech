import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API from "../../Config/API";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    portfolioCount: 0,
    servicesCount: 0,
    jobsCount: 0,
    teamCount: 0,
    contactsCount: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("pt_admin_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.allSettled([
      axios.get(`${API.BASE_URL}portfolio`),
      axios.get(`${API.BASE_URL}services`),
      axios.get(`${API.BASE_URL}jobs`),
      axios.get(`${API.BASE_URL}team`),
      axios.get(`${API.BASE_URL}admin/contacts`, { headers }),
    ]).then(([portRes, servRes, jobRes, teamRes, contRes]) => {
      if (!isMounted) return;
      setStats({
        portfolioCount: portRes.status === "fulfilled" ? portRes.value.data?.count || 0 : 0,
        servicesCount: servRes.status === "fulfilled" ? servRes.value.data?.count || 0 : 0,
        jobsCount: jobRes.status === "fulfilled" ? jobRes.value.data?.count || 0 : 0,
        teamCount: teamRes.status === "fulfilled" ? teamRes.value.data?.count || 0 : 0,
        contactsCount: contRes.status === "fulfilled" ? contRes.value.data?.count || 0 : 0,
      });

      if (contRes.status === "fulfilled" && contRes.value.data?.data) {
        setRecentInquiries(contRes.value.data.data.slice(0, 5));
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    {
      title: "Portfolio Projects",
      count: stats.portfolioCount,
      icon: "fas fa-images",
      color: "var(--pt-primary)",
      link: "/admin/portfolio",
      btnText: "Manage Gallery",
    },
    {
      title: "Core Services",
      count: stats.servicesCount,
      icon: "fas fa-cogs",
      color: "var(--pt-secondary)",
      link: "/admin/services",
      btnText: "Manage Services",
    },
    {
      title: "Career Openings",
      count: stats.jobsCount,
      icon: "fas fa-briefcase",
      color: "#10b981",
      link: "/admin/jobs",
      btnText: "Manage Careers",
    },
    {
      title: "Expert Team",
      count: stats.teamCount,
      icon: "fas fa-user-friends",
      color: "#f59e0b",
      link: "/admin/team",
      btnText: "Manage Team",
    },
    {
      title: "Customer Inquiries",
      count: stats.contactsCount,
      icon: "fas fa-envelope-open-text",
      color: "#ec4899",
      link: "/admin/contacts",
      btnText: "View Messages",
    },
  ];

  return (
    <div>
      {/* Page Title */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>
            Executive Overview
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "4px 0 0 0" }}>
            Live content management metrics and system status
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link
            to="/admin/portfolio"
            style={{
              background: "linear-gradient(135deg, var(--pt-primary) 0%, #b8141b 100%)",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "0.85rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 15px rgba(245, 32, 41, 0.35)",
            }}
          >
            <i className="fas fa-plus" />
            <span>Add Project</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="row g-4 mb-5">
        {statCards.map((item, idx) => (
          <div key={idx} className="col-xl col-md-4 col-6">
            <div
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "22px",
                boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.4)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: item.color,
                }}
              />
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span style={{ fontSize: "0.82rem", fontWeight: "600", color: "#94a3b8" }}>
                  {item.title}
                </span>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: `${item.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.color,
                    fontSize: "1.1rem",
                  }}
                >
                  <i className={item.icon} />
                </div>
              </div>

              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#ffffff", lineHeight: 1 }}>
                {loading ? "..." : item.count}
              </div>

              <Link
                to={item.link}
                style={{
                  marginTop: "16px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  color: item.color,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{item.btnText}</span>
                <i className="fas fa-arrow-right" style={{ fontSize: "0.75rem" }} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Launchpad & Recent Leads */}
      <div className="row g-4">
        {/* Quick Launchpad */}
        <div className="col-lg-6">
          <div
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "18px",
              padding: "26px",
              height: "100%",
            }}
          >
            <h4 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#ffffff", marginBottom: "16px" }}>
              <i className="fas fa-bolt me-2" style={{ color: "var(--pt-primary)" }} />
              Quick Content Launchpad
            </h4>
            <div className="d-flex flex-column gap-3">
              <Link
                to="/admin/portfolio"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  color: "#ffffff",
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(245, 32, 41, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--pt-primary)",
                    }}
                  >
                    <i className="fas fa-layer-group" />
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.92rem" }}>
                      Upload Project Showcase
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                      Add single or multiple screenshot galleries with tech tags
                    </div>
                  </div>
                </div>
                <i className="fas fa-chevron-right" style={{ color: "#64748b" }} />
              </Link>

              <Link
                to="/admin/services"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  color: "#ffffff",
                  textDecoration: "none",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(99, 102, 241, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--pt-secondary)",
                    }}
                  >
                    <i className="fas fa-cogs" />
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.92rem" }}>
                      Update Core Services
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                      Edit web, mobile, AI, and cloud service offerings
                    </div>
                  </div>
                </div>
                <i className="fas fa-chevron-right" style={{ color: "#64748b" }} />
              </Link>

              <Link
                to="/admin/jobs"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  color: "#ffffff",
                  textDecoration: "none",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(16, 185, 129, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#10b981",
                    }}
                  >
                    <i className="fas fa-user-plus" />
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.92rem" }}>Post Career Opening</div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                      Publish engineering and design openings to Careers page
                    </div>
                  </div>
                </div>
                <i className="fas fa-chevron-right" style={{ color: "#64748b" }} />
              </Link>

              <Link
                to="/admin/content"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  color: "#ffffff",
                  textDecoration: "none",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(245, 158, 11, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fbbf24",
                    }}
                  >
                    <i className="fas fa-sliders-h" />
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.92rem" }}>Edit Hero & Site Content</div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                      Customize homepage hero headlines, CTAs, about text, and contact info
                    </div>
                  </div>
                </div>
                <i className="fas fa-chevron-right" style={{ color: "#64748b" }} />
              </Link>

              <Link
                to="/admin/settings"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  color: "#ffffff",
                  textDecoration: "none",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(236, 72, 153, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ec4899",
                    }}
                  >
                    <i className="fas fa-key" />
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.92rem" }}>Update Admin Password</div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                      Change login password, update admin email, and verify database schema
                    </div>
                  </div>
                </div>
                <i className="fas fa-chevron-right" style={{ color: "#64748b" }} />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="col-lg-6">
          <div
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "18px",
              padding: "26px",
              height: "100%",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h4 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                <i className="fas fa-inbox me-2" style={{ color: "#ec4899" }} />
                Recent Client Inquiries
              </h4>
              <Link to="/admin/contacts" style={{ fontSize: "0.82rem", color: "#ec4899", fontWeight: "600" }}>
                View All →
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <div className="text-center py-4" style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
                <i className="fas fa-comments mb-2" style={{ fontSize: "1.8rem" }} />
                <div>No new customer inquiries right now.</div>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {recentInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    style={{
                      padding: "12px 14px",
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <strong style={{ fontSize: "0.88rem", color: "#ffffff" }}>{inq.name}</strong>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          padding: "2px 8px",
                          borderRadius: "99px",
                          background: inq.status === "new" ? "rgba(245, 32, 41, 0.2)" : "rgba(16, 185, 129, 0.2)",
                          color: inq.status === "new" ? "var(--pt-primary)" : "#34d399",
                          fontWeight: "700",
                          textTransform: "uppercase",
                        }}
                      >
                        {inq.status || "new"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>{inq.email}</div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "#94a3b8",
                        marginTop: "4px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {inq.contents}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

